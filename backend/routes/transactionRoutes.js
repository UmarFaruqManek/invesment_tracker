const express = require("express");
const router = express.Router();
const TransactionController = require("../controllers/transactionController");
const upload = require("../middleware/upload");

/**
 * GET /api/transactions
 * Mendapatkan semua transaksi
 */
router.get("/transactions", TransactionController.getAllTransactions);

/**
 * POST /api/transactions
 * Membuat transaksi baru dengan upload file bukti
 * Field form-data:
 * - asset_name (text)
 * - asset_type (text): IDX, US, atau CRYPTO
 * - total_spent (text): manual input
 * - currency (text): IDR atau USD
 * - date (text): format YYYY-MM-DD
 * - proof (file): optional, gambar atau PDF
 */
router.post(
  "/transactions",
  upload.single("proof"),
  TransactionController.createTransaction
);

/**
 * DELETE /api/transactions/:id
 * Hapus transaksi berdasarkan ID
 */
router.delete("/transactions/:id", TransactionController.deleteTransaction);

/**
 * GET /api/summary
 * Mendapatkan ringkasan total dana keluar per currency
 */
router.get("/summary", TransactionController.getSummary);

module.exports = router;
