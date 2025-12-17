# ✨ BACKEND SUMMARY - Penjelasan Fungsi

## 📁 Struktur Backend

```
backend/
├── config/
│   └── database.js           → Koneksi MySQL dengan pooling
├── middleware/
│   └── upload.js             → Multer config (file upload)
├── models/
│   └── transactionModel.js  → Database queries (CRUD + Summary)
├── controllers/
│   └── transactionController.js → Business logic & validasi
├── routes/
│   └── transactionRoutes.js → Define endpoints
├── uploads/                  → Folder bukti pembelian
├── examples/                 → Contoh JSON request
├── server.js                 → Entry point
├── database.sql              → Schema database
└── API_DOCUMENTATION.md      → Dokumentasi lengkap
```

---

## 🔧 Penjelasan Tiap File

### 1. **database.js** - Database Connection

```javascript
// MySQL connection pool dengan promise support
const pool = mysql.createPool({...});
const promisePool = pool.promise();
```

**Fungsi:** Koneksi ke MySQL, auto-reconnect, handle multiple queries.

---

### 2. **upload.js** - File Upload Middleware

**Fitur:**

- ✅ Filter: hanya JPEG, JPG, PNG, PDF
- ✅ Max size: 5MB
- ✅ Auto filename: `nama-timestamp-random.ext`
- ✅ Auto create folder `uploads/`

**Usage:** `upload.single("proof")`

---

### 3. **transactionModel.js** - Database Operations

**Methods:**

- `getAll()` → SELECT semua transaksi, sort by date DESC
- `getById(id)` → SELECT 1 transaksi
- `create(data)` → INSERT transaksi baru
- `update(id, data)` → UPDATE transaksi
- `delete(id)` → DELETE transaksi
- `getSummary()` → SUM total_spent + GROUP BY asset_type

---

### 4. **transactionController.js** - Business Logic

#### `createTransaction(req, res)`

1. Validasi input (required fields)
2. Validasi asset_type (IDX/US/CRYPTO)
3. Hitung total_spent = quantity × price_per_unit
4. Simpan file path jika ada upload
5. Insert ke database
6. Return response with ID baru

#### `updateTransaction(req, res)`

1. Check transaksi exist
2. Validasi input
3. Hapus file lama jika upload baru
4. Update database
5. Return updated data

#### `deleteTransaction(req, res)`

1. Check transaksi exist
2. Hapus file dari disk
3. Delete dari database
4. Return success message

#### `getSummary(req, res)`

1. Query total_spent
2. Query composition per asset_type
3. Hitung percentage
4. Return formatted data untuk chart

---

### 5. **transactionRoutes.js** - API Endpoints

| Route               | Method | Middleware             | Controller         |
| ------------------- | ------ | ---------------------- | ------------------ |
| `/transactions`     | GET    | -                      | getAllTransactions |
| `/transactions`     | POST   | upload.single("proof") | createTransaction  |
| `/transactions/:id` | PUT    | upload.single("proof") | updateTransaction  |
| `/transactions/:id` | DELETE | -                      | deleteTransaction  |
| `/summary`          | GET    | -                      | getSummary         |

---

### 6. **server.js** - Application Entry Point

```javascript
// Middleware
app.use(cors());                           // CORS enabled
app.use(express.json());                   // Parse JSON
app.use(express.urlencoded({extended:true})); // Parse form-data

// Static files
app.use("/uploads", express.static(...));  // Serve uploaded files

// Routes
app.use("/api", transactionRoutes);        // Mount API routes

// Error handling
app.use((err, req, res, next) => {...});   // Global error handler
app.use((req, res) => {...});              // 404 handler
```

---

## 📝 Contoh Request JSON

### 1. POST /api/transactions (Saham IDX)

```json
{
  "asset_name": "BBCA",
  "asset_type": "IDX",
  "quantity": 100,
  "price_per_unit": 8500,
  "date": "2025-12-17"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Transaksi berhasil dibuat",
  "data": {
    "id": 1,
    "total_spent": 850000,
    ...
  }
}
```

### 2. POST /api/transactions (Saham US)

```json
{
  "asset_name": "AAPL",
  "asset_type": "US",
  "quantity": 10,
  "price_per_unit": 150.5,
  "date": "2025-12-16"
}
```

### 3. POST /api/transactions (Crypto)

```json
{
  "asset_name": "BTC",
  "asset_type": "CRYPTO",
  "quantity": 0.01,
  "price_per_unit": 42000,
  "date": "2025-12-15"
}
```

### 4. GET /api/summary

**Response:**

```json
{
  "success": true,
  "data": {
    "total_spent": 2500000,
    "composition": [
      {
        "asset_type": "IDX",
        "total_spent": 1000000,
        "transaction_count": 5,
        "percentage": "40.00"
      },
      {
        "asset_type": "US",
        "total_spent": 1000000,
        "transaction_count": 3,
        "percentage": "40.00"
      },
      {
        "asset_type": "CRYPTO",
        "total_spent": 500000,
        "transaction_count": 2,
        "percentage": "20.00"
      }
    ]
  }
}
```

---

## 🧪 Quick Testing

### Test dengan cURL:

**1. Create Transaction (tanpa file):**

```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"asset_name":"BBCA","asset_type":"IDX","quantity":100,"price_per_unit":8500,"date":"2025-12-17"}'
```

**2. Get All Transactions:**

```bash
curl http://localhost:5000/api/transactions
```

**3. Get Summary:**

```bash
curl http://localhost:5000/api/summary
```

**4. Delete Transaction:**

```bash
curl -X DELETE http://localhost:5000/api/transactions/1
```

### Test dengan Postman:

- Import: Pilih "form-data" untuk POST/PUT dengan file
- Field `proof`: pilih type "File"
- Field lainnya: type "Text"

---

## 📚 File Locations

- **API Docs:** [API_DOCUMENTATION.md](file:///d:/APLIKASI%20PENCATATAN%20ASET%20PRIBADI/backend/API_DOCUMENTATION.md)
- **Examples:** [backend/examples/](file:///d:/APLIKASI%20PENCATATAN%20ASET%20PRIBADI/backend/examples)
- **Main README:** [README.md](file:///d:/APLIKASI%20PENCATATAN%20ASET%20PRIBADI/README.md)

**Status:** ✅ Backend API ready to use!
