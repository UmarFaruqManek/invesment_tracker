const fs = require("fs");
const path = require("path");

// Path ke file JSON database
const DB_PATH = path.join(__dirname, "..", "data", "transactions.json");

// Pastikan folder data ada
const DATA_DIR = path.join(__dirname, "..", "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Pastikan file database ada
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(
    DB_PATH,
    JSON.stringify({ transactions: [], nextId: 1 }, null, 2)
  );
}

/**
 * Read database
 */
const readDB = () => {
  try {
    const data = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return { transactions: [], nextId: 1 };
  }
};

/**
 * Write database
 */
const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing database:", error);
    return false;
  }
};

/**
 * Transaction Model with JSON storage
 */
const TransactionModel = {
  /**
   * Get all transactions
   */
  getAll: async () => {
    const db = readDB();
    // Sort by date DESC
    return db.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  /**
   * Get transaction by ID
   */
  getById: async (id) => {
    const db = readDB();
    return db.transactions.find((t) => t.id === parseInt(id));
  },

  /**
   * Create new transaction
   */
  create: async (data) => {
    const db = readDB();
    const newTransaction = {
      id: db.nextId,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.transactions.push(newTransaction);
    db.nextId += 1;

    writeDB(db);
    return { insertId: newTransaction.id };
  },

  /**
   * Update transaction
   */
  update: async (id, data) => {
    const db = readDB();
    const index = db.transactions.findIndex((t) => t.id === parseInt(id));

    if (index === -1) {
      return { affectedRows: 0 };
    }

    db.transactions[index] = {
      ...db.transactions[index],
      ...data,
      id: parseInt(id), // Keep original ID
      updated_at: new Date().toISOString(),
    };

    writeDB(db);
    return { affectedRows: 1 };
  },

  /**
   * Delete transaction
   */
  delete: async (id) => {
    const db = readDB();
    const initialLength = db.transactions.length;
    db.transactions = db.transactions.filter((t) => t.id !== parseInt(id));

    if (db.transactions.length < initialLength) {
      writeDB(db);
      return { affectedRows: 1 };
    }

    return { affectedRows: 0 };
  },

  /**
   * Get summary (total spent & composition)
   */
  getSummary: async () => {
    const db = readDB();
    const transactions = db.transactions;

    // Calculate total spent
    const total_spent = transactions.reduce(
      (sum, t) => sum + parseFloat(t.total_spent || 0),
      0
    );

    // Calculate composition by asset_type
    const compositionMap = {};
    transactions.forEach((t) => {
      if (!compositionMap[t.asset_type]) {
        compositionMap[t.asset_type] = {
          asset_type: t.asset_type,
          total_spent: 0,
          transaction_count: 0,
        };
      }
      compositionMap[t.asset_type].total_spent += parseFloat(
        t.total_spent || 0
      );
      compositionMap[t.asset_type].transaction_count += 1;
    });

    const composition = Object.values(compositionMap);

    return {
      total_spent,
      composition,
    };
  },
};

module.exports = TransactionModel;
