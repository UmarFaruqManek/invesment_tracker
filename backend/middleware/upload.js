const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Folder untuk foto bukti pembelian
const uploadDir = "./uploads/bukti-pembelian";

// Pastikan folder ada
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi storage untuk Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Gunakan tanggal dari form data sebagai nama file
    const date = req.body.date || new Date().toISOString().split("T")[0];
    const ext = path.extname(file.originalname);

    // Format: YYYY-MM-DD-timestamp.ext
    // Contoh: 2025-12-17-1734567890123.jpg
    const filename = `${date}-${Date.now()}${ext}`;
    cb(null, filename);
  },
});

// Filter file - hanya terima gambar dan PDF
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Hanya file gambar (JPEG, JPG, PNG) dan PDF yang diizinkan!"));
  }
};

// Maksimal ukuran file 5MB
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter,
});

module.exports = upload;
