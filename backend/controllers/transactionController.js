const TransactionModel = require("../models/transactionModel");
const fs = require("fs");
const path = require("path");

/**
 * Controller untuk menangani operasi transaksi
 */
const TransactionController = {
  /**
   * GET /api/transactions
   * Mendapatkan semua transaksi
   */
  getAllTransactions: async (req, res) => {
    try {
      const transactions = await TransactionModel.getAll();
      res.json({
        success: true,
        data: transactions,
      });
    } catch (error) {
      console.error("Error getting transactions:", error);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data transaksi",
        error: error.message,
      });
    }
  },

  /**
   * POST /api/transactions
   * Membuat transaksi baru dengan upload file bukti
   */
  createTransaction: async (req, res) => {
    try {
      const {
        asset_name,
        asset_type,
        quantity,
        price_per_unit,
        total_spent,
        currency,
        date,
      } = req.body;

      // Validasi input
      if (!asset_name || !asset_type || !date || !currency) {
        return res.status(400).json({
          success: false,
          message: "Field wajib: asset_name, asset_type, date, currency",
        });
      }

      // Validasi asset_type
      const validAssetTypes = ["IDX", "US", "CRYPTO"];
      if (!validAssetTypes.includes(asset_type)) {
        return res.status(400).json({
          success: false,
          message: "asset_type harus salah satu dari: IDX, US, CRYPTO",
        });
      }

      // Validasi currency
      const validCurrencies = ["IDR", "USD"];
      if (!validCurrencies.includes(currency)) {
        return res.status(400).json({
          success: false,
          message: "currency harus salah satu dari: IDR, USD",
        });
      }

      // Path bukti pembelian jika ada file upload
      const proof_path = req.file
        ? `/uploads/bukti-pembelian/${req.file.filename}`
        : null;

      const transactionData = {
        asset_name,
        asset_type,
        quantity: quantity ? parseFloat(quantity) : 0,
        price_per_unit: price_per_unit ? parseFloat(price_per_unit) : 0,
        total_spent: total_spent ? parseFloat(total_spent) : 0,
        currency,
        date,
        proof_path,
      };

      const result = await TransactionModel.create(transactionData);

      res.status(201).json({
        success: true,
        message: "Transaksi berhasil dibuat",
        data: {
          id: result.insertId,
          ...transactionData,
        },
      });
    } catch (error) {
      console.error("Error creating transaction:", error);

      // Hapus file jika ada error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        success: false,
        message: "Gagal membuat transaksi",
        error: error.message,
      });
    }
  },

  /**
   * GET /api/transactions/:id
   * Mendapatkan transaksi berdasarkan ID
   */
  getTransactionById: async (req, res) => {
    try {
      const { id } = req.params;
      const transaction = await TransactionModel.getById(id);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: "Transaksi tidak ditemukan",
        });
      }

      res.json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      console.error("Error getting transaction:", error);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data transaksi",
        error: error.message,
      });
    }
  },

  /**
   * PUT /api/transactions/:id
   * Update transaksi berdasarkan ID
   */
  updateTransaction: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        asset_name,
        asset_type,
        quantity,
        price_per_unit,
        total_spent,
        currency,
        date,
      } = req.body;

      // Check if transaction exists
      const existingTransaction = await TransactionModel.getById(id);
      if (!existingTransaction) {
        return res.status(404).json({
          success: false,
          message: "Transaksi tidak ditemukan",
        });
      }

      // Validasi input
      if (!asset_name || !asset_type || !date || !currency) {
        return res.status(400).json({
          success: false,
          message: "Field wajib: asset_name, asset_type, date, currency",
        });
      }

      // Handle file upload - if new file uploaded, delete old one
      let proof_path = existingTransaction.proof_path;
      if (req.file) {
        // Delete old file if exists
        if (existingTransaction.proof_path) {
          const oldFilePath = path.join(
            __dirname,
            "..",
            existingTransaction.proof_path
          );
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        proof_path = "/" + req.file.path.replace(/\\/g, "/");
      }

      const transactionData = {
        asset_name,
        asset_type,
        quantity: quantity ? parseFloat(quantity) : null,
        price_per_unit: price_per_unit ? parseFloat(price_per_unit) : null,
        total_spent: parseFloat(total_spent),
        currency,
        date,
        proof_path,
      };

      const result = await TransactionModel.update(id, transactionData);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Transaksi tidak ditemukan atau tidak ada perubahan",
        });
      }

      res.json({
        success: true,
        message: "Transaksi berhasil diupdate",
        data: { id: parseInt(id), ...transactionData },
      });
    } catch (error) {
      console.error("Error updating transaction:", error);
      res.status(500).json({
        success: false,
        message: "Gagal mengupdate transaksi",
        error: error.message,
      });
    }
  },

  /**
   * DELETE /api/transactions/:id
   * Hapus transaksi berdasarkan ID
   */
  deleteTransaction: async (req, res) => {
    try {
      const { id } = req.params;

      // Cek apakah transaksi ada
      const transaction = await TransactionModel.getById(id);
      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: "Transaksi tidak ditemukan",
        });
      }

      // Hapus file bukti jika ada
      if (transaction.proof_path) {
        const filePath = path.join(__dirname, "..", transaction.proof_path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await TransactionModel.delete(id);

      res.json({
        success: true,
        message: "Transaksi berhasil dihapus",
      });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      res.status(500).json({
        success: false,
        message: "Gagal menghapus transaksi",
        error: error.message,
      });
    }
  },

  /**
   * GET /api/summary
   * Mendapatkan ringkasan total dana keluar per currency
   */
  getSummary: async (req, res) => {
    try {
      const transactions = await TransactionModel.getAll();

      // Calculate totals per currency
      let total_idr = 0;
      let total_usd = 0;

      transactions.forEach((t) => {
        if (t.currency === "IDR") {
          total_idr += parseFloat(t.total_spent || 0);
        } else if (t.currency === "USD") {
          total_usd += parseFloat(t.total_spent || 0);
        }
      });

      // Composition per asset type
      const compositionMap = {};
      transactions.forEach((t) => {
        const key = `${t.asset_type}_${t.currency}`;
        if (!compositionMap[key]) {
          compositionMap[key] = {
            asset_type: t.asset_type,
            currency: t.currency,
            total_spent: 0,
            transaction_count: 0,
          };
        }
        compositionMap[key].total_spent += parseFloat(t.total_spent || 0);
        compositionMap[key].transaction_count += 1;
      });

      const composition = Object.values(compositionMap);

      // Assets breakdown per name
      const assetsMap = {};
      transactions.forEach((t) => {
        const key = `${t.asset_name}_${t.currency}`;
        if (!assetsMap[key]) {
          assetsMap[key] = {
            asset_name: t.asset_name,
            asset_type: t.asset_type,
            currency: t.currency,
            total_spent: 0,
            total_quantity: 0,
            transaction_count: 0,
          };
        }
        assetsMap[key].total_spent += parseFloat(t.total_spent || 0);
        assetsMap[key].total_quantity += parseFloat(t.quantity || 0);
        assetsMap[key].transaction_count += 1;
      });

      const assets = Object.values(assetsMap).sort(
        (a, b) => b.total_spent - a.total_spent
      );

      res.json({
        success: true,
        data: {
          total_idr: parseFloat(total_idr),
          total_usd: parseFloat(total_usd),
          composition,
          assets,
        },
      });
    } catch (error) {
      console.error("Error getting summary:", error);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil summary",
        error: error.message,
      });
    }
  },
};

module.exports = TransactionController;
