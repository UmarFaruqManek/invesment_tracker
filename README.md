# 💼 Personal Investment Tracker

Aplikasi web untuk mencatat dan melacak investasi pribadi Anda di berbagai aset seperti saham Indonesia (IDX), saham Amerika (US), dan cryptocurrency. Dilengkapi dengan dashboard visualisasi yang interaktif dan sistem manajemen transaksi yang lengkap.

![Investment Tracker](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Deskripsi

Personal Investment Tracker adalah aplikasi full-stack untuk mengelola portfolio investasi dengan fitur:

- 📊 **Dashboard Interaktif** dengan donut chart untuk visualisasi aset
- 💰 **Multi-Currency** mendukung IDR dan USD
- 📈 **Track Multiple Assets** saham IDX, US, dan cryptocurrency
- 📁 **Upload Bukti Transaksi** dalam format gambar atau PDF
- 🎯 **Analytics** mendetail per aset, tipe, dan mata uang

## ✨ Fitur Utama

### 1. Dashboard Analytics

- **2 Donut Charts** terpisah untuk aset IDR dan USD
- **Summary Cards** dengan gradient design
- **Detail Table** dengan progress bar persentase
- **Empty State** yang informatif untuk data kosong

### 2. Manajemen Transaksi

- **Tambah Transaksi** dengan form lengkap:
  - Nama aset (BBCA, AAPL, BTC, dll)
  - Tipe aset (IDX/US/CRYPTO)
  - Quantity & Price per unit
  - Total spent dengan auto-calculate
  - Currency (IDR/USD)
  - Upload bukti pembelian (foto/PDF)
- **List Transaksi** dengan:
  - Tabel lengkap semua transaksi
  - Filter dan sorting
  - View bukti pembelian
  - Delete transaksi

### 3. Upload Bukti Pembelian

- Support format: JPG, PNG, PDF
- Preview sebelum upload
- Naming convention berdasarkan tanggal
- Storage terorganisir di folder `/uploads/bukti-pembelian/`

### 4. Summary & Analytics

- Total uang keluar (terpisah IDR & USD)
- Komposisi per tipe aset
- Breakdown per nama aset
- Jumlah quantity dan transaksi
- Persentase alokasi

## 🛠️ Teknologi yang Digunakan

### Backend

- **Node.js** v18+
- **Express.js** - Web framework
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing
- **JSON File Storage** - Simple database

### Frontend

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router** - Routing
- **Chart.js** & **react-chartjs-2** - Data visualization
- **Axios** - HTTP client
- **Vanilla CSS** - Styling

## 📦 Instalasi

### Prerequisites

- Node.js v18 atau lebih tinggi
- npm atau yarn

### 1. Clone Repository

```bash
git clone <repository-url>
cd APLIKASI-PENCATATAN-ASET-PRIBADI
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env dan sesuaikan PORT jika perlu (default: 5000)

# Buat folder uploads dan data
mkdir -p uploads/bukti-pembelian
mkdir -p data

# Setup database file
cp data/transactions.example.json data/transactions.json
```

### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Sesuaikan VITE_API_URL jika backend berjalan di port lain
```

## 🚀 Menjalankan Aplikasi

### Development Mode

#### Terminal 1 - Jalankan Backend

```bash
cd backend
npm run dev
```

Backend akan berjalan di `http://localhost:5000`

#### Terminal 2 - Jalankan Frontend

```bash
cd frontend
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

Buka browser dan akses `http://localhost:5173`

### Production Build

#### Build Frontend

```bash
cd frontend
npm run build
```

Output akan ada di folder `dist/`

#### Run Backend Production

```bash
cd backend
npm start
```

## 📁 Struktur Folder

```
APLIKASI-PENCATATAN-ASET-PRIBADI/
├── backend/
│   ├── controllers/         # Business logic
│   ├── middleware/          # Multer upload config
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   ├── data/               # JSON database
│   │   └── transactions.json
│   ├── uploads/            # User uploaded files
│   │   └── bukti-pembelian/
│   ├── server.js           # Entry point
│   ├── .env.example        # Environment template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── AddTransaction.tsx
│   │   │   └── Transactions.tsx
│   │   ├── services/       # API calls
│   │   └── utils/          # Helper functions
│   ├── public/
│   ├── index.html
│   ├── .env.example
│   └── package.json
│
├── README.md
├── .gitignore
└── Documentation files
```

## 🌐 API Endpoints

### Transactions

- `GET /api/summary` - Mendapatkan ringkasan portfolio
- `GET /api/transactions` - List semua transaksi
- `GET /api/transactions/:id` - Detail transaksi
- `POST /api/transactions` - Tambah transaksi baru
- `DELETE /api/transactions/:id` - Hapus transaksi

Lihat [API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md) untuk detail lengkap.

## 📝 Cara Penggunaan

### 1. Tambah Transaksi

1. Klik "Tambah Transaksi" di dashboard
2. Isi form:
   - Pilih tipe aset (IDX/US/CRYPTO)
   - Masukkan nama aset (contoh: BBCA, AAPL, BTC)
   - Input quantity dan price per unit (atau langsung total spent)
   - Pilih currency (IDR/USD)
   - Upload bukti pembelian
3. Klik "Simpan Transaksi"

### 2. Lihat Dashboard

- Dashboard otomatis update setelah transaksi ditambahkan
- Charts menampilkan breakdown per aset dan currency
- Cards menampilkan total investasi

### 3. Kelola Transaksi

- List transaksi menampilkan semua data
- Klik link bukti untuk melihat file upload
- Delete transaksi yang tidak diperlukan

## 🎨 Screenshots

### Dashboard

Dashboard menampilkan 2 donut chart terpisah untuk aset IDR dan USD, dilengkapi summary cards dan detail table.

### Add Transaction

Form lengkap untuk menambahkan transaksi dengan auto-calculate total spent dan preview upload.

### Transactions List

Tabel dengan semua transaksi, termasuk quantity, price, dan link ke bukti pembelian.

## 📚 Dokumentasi Tambahan

- [API Documentation](./backend/API_DOCUMENTATION.md) - Panduan lengkap API
- [Backend Summary](./backend/BACKEND_SUMMARY.md) - Penjelasan backend code
- [Frontend Guide](./frontend/FRONTEND_GUIDE.md) - Penjelasan frontend code
- [Testing Guide](./TESTING_GUIDE.md) - Cara testing aplikasi
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Panduan deployment

## 🔧 Configuration

### Environment Variables

#### Backend (.env)

```env
PORT=5000
```

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## ⚠️ Important Notes

1. **Database File**: `backend/data/transactions.json` **TIDAK** di-commit ke git untuk menjaga privasi data
2. **Uploads Folder**: Semua file upload dalam `backend/uploads/` juga **TIDAK** di-commit
3. **Environment Files**: File `.env` berisi konfigurasi lokal yang **TIDAK** di-commit
4. **Backup**: Selalu backup file `transactions.json` secara berkala

## 🐛 Troubleshooting

### Port Sudah Digunakan

Jika port 5000 atau 5173 sudah digunakan:

- Backend: Ubah `PORT` di `backend/.env`
- Frontend: Ubah `VITE_API_URL` di `frontend/.env`

### CORS Error

Pastikan backend berjalan di port yang benar dan frontend mengakses URL yang tepat.

### Upload Failed

Pastikan folder `backend/uploads/bukti-pembelian/` ada dan memiliki write permission.

## 🤝 Contributing

Contributions welcome! Silakan buat issue atau pull request.

## 📄 License

MIT License - Bebas digunakan untuk keperluan pribadi atau komersial.

## 👨‍💻 Author

Aplikasi ini dibuat untuk keperluan tracking investasi pribadi.

---

**Happy Investing! 📈💰**
