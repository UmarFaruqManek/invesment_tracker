const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files untuk bukti pembelian
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const transactionRoutes = require("./routes/transactionRoutes");
app.use("/api", transactionRoutes);

// Test route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running with JSON database" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Multer error handling
  if (err.message && err.message.includes("file")) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: err.message || "Terjadi kesalahan pada server",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint tidak ditemukan",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database: JSON file-based storage`);
  console.log(`Static files served at: http://localhost:${PORT}/uploads`);
});
