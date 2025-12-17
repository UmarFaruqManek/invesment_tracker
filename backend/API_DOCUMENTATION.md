# API Documentation - Investment Tracker Backend

Base URL: `http://localhost:5000/api`

---

## Endpoints

### 1. GET /transactions

Mendapatkan semua transaksi

**Request:**

```
GET /api/transactions
```

**Response Success (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "asset_name": "BBCA",
      "asset_type": "IDX",
      "quantity": 100,
      "price_per_unit": 8500,
      "total_spent": 850000,
      "date": "2025-12-17",
      "proof_path": "/uploads/bukti-1734567890123.jpg",
      "created_at": "2025-12-17T10:30:00.000Z",
      "updated_at": "2025-12-17T10:30:00.000Z"
    }
  ]
}
```

---

### 2. POST /transactions

Membuat transaksi baru dengan upload bukti pembelian (opsional)

**Request:**

- Method: `POST`
- Content-Type: `multipart/form-data`

**Form Data:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| asset_name | text | Yes | Nama aset (contoh: BBCA, AAPL, BTC) |
| asset_type | text | Yes | Tipe aset: `IDX`, `US`, atau `CRYPTO` |
| quantity | number | Yes | Jumlah unit yang dibeli |
| price_per_unit | number | Yes | Harga per unit |
| date | text | Yes | Tanggal pembelian (format: YYYY-MM-DD) |
| proof | file | No | File bukti (gambar/PDF, max 5MB) |

**Contoh Request (cURL):**

```bash
curl -X POST http://localhost:5000/api/transactions \
  -F "asset_name=BBCA" \
  -F "asset_type=IDX" \
  -F "quantity=100" \
  -F "price_per_unit=8500" \
  -F "date=2025-12-17" \
  -F "proof=@/path/to/bukti.jpg"
```

**Contoh Request (JavaScript/Axios):**

```javascript
const formData = new FormData();
formData.append("asset_name", "BBCA");
formData.append("asset_type", "IDX");
formData.append("quantity", 100);
formData.append("price_per_unit", 8500);
formData.append("date", "2025-12-17");
formData.append("proof", fileInput.files[0]); // File dari input

const response = await axios.post(
  "http://localhost:5000/api/transactions",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);
```

**Response Success (201):**

```json
{
  "success": true,
  "message": "Transaksi berhasil dibuat",
  "data": {
    "id": 1,
    "asset_name": "BBCA",
    "asset_type": "IDX",
    "quantity": 100,
    "price_per_unit": 8500,
    "total_spent": 850000,
    "date": "2025-12-17",
    "proof_path": "/uploads/bukti-1734567890123.jpg"
  }
}
```

**Response Error (400):**

```json
{
  "success": false,
  "message": "Semua field wajib diisi"
}
```

---

### 3. PUT /transactions/:id

Update transaksi berdasarkan ID

**Request:**

- Method: `PUT`
- Content-Type: `multipart/form-data`
- URL: `/api/transactions/:id`

**Form Data:** (sama seperti POST)

**Contoh Request (cURL):**

```bash
curl -X PUT http://localhost:5000/api/transactions/1 \
  -F "asset_name=BBCA" \
  -F "asset_type=IDX" \
  -F "quantity=150" \
  -F "price_per_unit=8600" \
  -F "date=2025-12-17" \
  -F "proof=@/path/to/bukti-baru.jpg"
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Transaksi berhasil diupdate",
  "data": {
    "id": 1,
    "asset_name": "BBCA",
    "asset_type": "IDX",
    "quantity": 150,
    "price_per_unit": 8600,
    "total_spent": 1290000,
    "date": "2025-12-17",
    "proof_path": "/uploads/bukti-baru-1734567990456.jpg"
  }
}
```

**Response Error (404):**

```json
{
  "success": false,
  "message": "Transaksi tidak ditemukan"
}
```

---

### 4. DELETE /transactions/:id

Hapus transaksi berdasarkan ID

**Request:**

```
DELETE /api/transactions/:id
```

**Contoh Request (cURL):**

```bash
curl -X DELETE http://localhost:5000/api/transactions/1
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Transaksi berhasil dihapus"
}
```

**Response Error (404):**

```json
{
  "success": false,
  "message": "Transaksi tidak ditemukan"
}
```

---

### 5. GET /summary

Mendapatkan ringkasan total dana keluar dan komposisi aset

**Request:**

```
GET /api/summary
```

**Response Success (200):**

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

## Testing dengan Postman / Thunder Client

### Cara Test POST /transactions

1. Buat request baru dengan method `POST`
2. URL: `http://localhost:5000/api/transactions`
3. Pilih tab "Body" → "form-data"
4. Tambahkan fields:
   - `asset_name`: `BBCA` (text)
   - `asset_type`: `IDX` (text)
   - `quantity`: `100` (text)
   - `price_per_unit`: `8500` (text)
   - `date`: `2025-12-17` (text)
   - `proof`: pilih file (file)

### Cara Test GET /transactions

1. Method: `GET`
2. URL: `http://localhost:5000/api/transactions`
3. Klik Send

### Cara Test PUT /transactions/:id

1. Method: `PUT`
2. URL: `http://localhost:5000/api/transactions/1`
3. Body sama seperti POST

### Cara Test DELETE /transactions/:id

1. Method: `DELETE`
2. URL: `http://localhost:5000/api/transactions/1`
3. Klik Send

### Cara Test GET /summary

1. Method: `GET`
2. URL: `http://localhost:5000/api/summary`
3. Klik Send

---

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Semua field wajib diisi"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Transaksi tidak ditemukan"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Gagal membuat transaksi",
  "error": "Error details..."
}
```

---

## File Upload Specifications

- **Allowed formats:** JPEG, JPG, PNG, PDF
- **Maximum file size:** 5MB
- **Storage location:** `/uploads` folder
- **File naming:** `[original-name]-[timestamp]-[random].[ext]`
- **Access URL:** `http://localhost:5000/uploads/[filename]`

---

## Notes

- `total_spent` dihitung otomatis dari `quantity * price_per_unit`
- Saat update atau delete, file bukti lama akan dihapus jika ada file baru
- File bukti bersifat opsional
- Semua response menggunakan format JSON
