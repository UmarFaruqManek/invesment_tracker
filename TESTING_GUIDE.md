# 🧪 Testing Guide - Postman & API Testing

## 📋 Prerequisites

- ✅ Backend server running di `http://localhost:5000`
- ✅ Database MySQL sudah disetup
- ✅ Postman installed (atau Thunder Client di VS Code)

---

## 🚀 Quick Start

### 1. Import Environment (Optional)

Buat Environment di Postman:

- Variable: `BASE_URL`
- Value: `http://localhost:5000/api`

---

## 📝 Testing Semua Endpoint

### 1️⃣ GET /api/health (Health Check)

**Purpose:** Test apakah server berjalan

**Method:** `GET`  
**URL:** `http://localhost:5000/api/health`

**Expected Response (200):**

```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

### 2️⃣ POST /api/transactions (Create Transaction)

**Purpose:** Menambah transaksi baru dengan upload file

**Method:** `POST`  
**URL:** `http://localhost:5000/api/transactions`  
**Body Type:** `form-data`

**Form Fields:**

| Key            | Type | Value                   | Required |
| -------------- | ---- | ----------------------- | -------- |
| asset_name     | Text | `BBCA`                  | Yes      |
| asset_type     | Text | `IDX`                   | Yes      |
| quantity       | Text | `100`                   | Yes      |
| price_per_unit | Text | `8500`                  | Yes      |
| date           | Text | `2025-12-17`            | Yes      |
| proof          | File | (pilih file gambar/PDF) | No       |

**Cara di Postman:**

1. Pilih method `POST`
2. URL: `http://localhost:5000/api/transactions`
3. Tab "Body" → pilih "form-data"
4. Tambahkan key-value seperti tabel di atas
5. Untuk `proof`: hover → ubah type dari "Text" ke "File" → pilih file
6. Click "Send"

**Expected Response (201):**

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
    "proof_path": "/uploads/bukti-1734567890123-456789.jpg"
  }
}
```

**Test Cases:**

#### ✅ Test Case 1: Transaksi Saham Indonesia (IDX)

```
asset_name: BBRI
asset_type: IDX
quantity: 50
price_per_unit: 5000
date: 2025-12-17
```

#### ✅ Test Case 2: Transaksi Saham US

```
asset_name: AAPL
asset_type: US
quantity: 5
price_per_unit: 180.50
date: 2025-12-16
```

#### ✅ Test Case 3: Transaksi Crypto

```
asset_name: BTC
asset_type: CRYPTO
quantity: 0.01
price_per_unit: 42000
date: 2025-12-15
```

#### ❌ Test Case 4: Validasi Error - Missing Field

```
asset_name: BBCA
(asset_type tidak diisi)
```

**Expected:** Error 400 - "Semua field wajib diisi"

#### ❌ Test Case 5: Validasi Error - Invalid Asset Type

```
asset_name: BBCA
asset_type: INVALID
quantity: 100
price_per_unit: 8500
date: 2025-12-17
```

**Expected:** Error 400 - "asset_type harus salah satu dari: IDX, US, CRYPTO"

#### ❌ Test Case 6: Validasi Error - File Too Large

```
Upload file > 5MB
```

**Expected:** Error 400 - "File terlalu besar. Maksimal 5MB"

#### ❌ Test Case 7: Validasi Error - Invalid File Type

```
Upload file .txt atau .exe
```

**Expected:** Error 400 - "Hanya file gambar (JPEG, JPG, PNG) dan PDF yang diizinkan!"

---

### 3️⃣ GET /api/transactions (Get All Transactions)

**Method:** `GET`  
**URL:** `http://localhost:5000/api/transactions`

**Expected Response (200):**

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
    },
    {
      "id": 2,
      "asset_name": "AAPL",
      "asset_type": "US",
      "quantity": 5,
      "price_per_unit": 180.5,
      "total_spent": 902.5,
      "date": "2025-12-16",
      "proof_path": null,
      "created_at": "2025-12-16T15:20:00.000Z",
      "updated_at": "2025-12-16T15:20:00.000Z"
    }
  ]
}
```

---

### 4️⃣ PUT /api/transactions/:id (Update Transaction)

**Method:** `PUT`  
**URL:** `http://localhost:5000/api/transactions/1`  
**Body Type:** `form-data`

**Form Fields:** (sama seperti POST)

**Example:**

```
asset_name: BBCA
asset_type: IDX
quantity: 150
price_per_unit: 8600
date: 2025-12-17
proof: (file baru, optional)
```

**Expected Response (200):**

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
    "proof_path": "/uploads/bukti-new-1734590000000.jpg"
  }
}
```

**Test Cases:**

#### ✅ Test Case 1: Update tanpa ganti file

Kirim semua field KECUALI `proof`

#### ✅ Test Case 2: Update dengan file baru

Kirim semua field TERMASUK `proof` (file lama akan dihapus)

#### ❌ Test Case 3: Update ID tidak ada

URL: `/api/transactions/999`  
**Expected:** Error 404 - "Transaksi tidak ditemukan"

---

### 5️⃣ DELETE /api/transactions/:id (Delete Transaction)

**Method:** `DELETE`  
**URL:** `http://localhost:5000/api/transactions/1`

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Transaksi berhasil dihapus"
}
```

**Test Cases:**

#### ✅ Test Case 1: Delete existing transaction

URL: `/api/transactions/1`  
**Expected:** Success, file bukti juga terhapus

#### ❌ Test Case 2: Delete non-existing ID

URL: `/api/transactions/999`  
**Expected:** Error 404 - "Transaksi tidak ditemukan"

---

### 6️⃣ GET /api/summary (Get Summary)

**Method:** `GET`  
**URL:** `http://localhost:5000/api/summary`

**Expected Response (200):**

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

## 🎯 Complete Testing Workflow

### Step-by-Step Test Scenario

1. **Health Check**

   ```
   GET /api/health
   ✅ Server running
   ```

2. **Create 3 Transactions**

   ```
   POST /api/transactions (IDX - BBCA)
   POST /api/transactions (US - AAPL)
   POST /api/transactions (CRYPTO - BTC)
   ✅ All created successfully
   ```

3. **Get All Transactions**

   ```
   GET /api/transactions
   ✅ Returns 3 transactions
   ```

4. **Get Summary**

   ```
   GET /api/summary
   ✅ Shows total_spent & composition
   ```

5. **Update Transaction**

   ```
   PUT /api/transactions/1
   ✅ Transaction updated
   ```

6. **Delete Transaction**

   ```
   DELETE /api/transactions/2
   ✅ Transaction deleted
   ```

7. **Verify Changes**
   ```
   GET /api/transactions
   ✅ Returns 2 transactions (1 deleted)
   GET /api/summary
   ✅ Summary updated
   ```

---

## 📁 Testing File Upload

### Valid Files:

- ✅ `bukti.jpg` (JPEG image)
- ✅ `bukti.png` (PNG image)
- ✅ `bukti.pdf` (PDF document)
- ✅ File < 5MB

### Invalid Files:

- ❌ `document.txt` (Not allowed)
- ❌ `file.docx` (Not allowed)
- ❌ `large-image.jpg` (> 5MB)

### Cara Test di Postman:

1. Di form-data, pilih key `proof`
2. Hover → change type to "File"
3. Click "Select Files"
4. Pilih file untuk test
5. Send request

---

## 🔗 View Uploaded Files

Setelah upload, akses file di browser:

```
http://localhost:5000/uploads/[filename]
```

Example:

```
http://localhost:5000/uploads/bukti-1734567890123-456789.jpg
```

---

## 📊 Postman Collection (JSON)

Buat Collection baru di Postman dengan requests berikut:

```json
{
  "info": {
    "name": "Investment Tracker API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "{{BASE_URL}}/health"
      }
    },
    {
      "name": "Get All Transactions",
      "request": {
        "method": "GET",
        "url": "{{BASE_URL}}/transactions"
      }
    },
    {
      "name": "Create Transaction",
      "request": {
        "method": "POST",
        "url": "{{BASE_URL}}/transactions",
        "body": {
          "mode": "formdata",
          "formdata": [
            { "key": "asset_name", "value": "BBCA", "type": "text" },
            { "key": "asset_type", "value": "IDX", "type": "text" },
            { "key": "quantity", "value": "100", "type": "text" },
            { "key": "price_per_unit", "value": "8500", "type": "text" },
            { "key": "date", "value": "2025-12-17", "type": "text" },
            { "key": "proof", "type": "file", "src": "" }
          ]
        }
      }
    },
    {
      "name": "Update Transaction",
      "request": {
        "method": "PUT",
        "url": "{{BASE_URL}}/transactions/1"
      }
    },
    {
      "name": "Delete Transaction",
      "request": {
        "method": "DELETE",
        "url": "{{BASE_URL}}/transactions/1"
      }
    },
    {
      "name": "Get Summary",
      "request": {
        "method": "GET",
        "url": "{{BASE_URL}}/summary"
      }
    }
  ]
}
```

---

## ✅ Expected Results Checklist

- [ ] Health check returns "OK"
- [ ] Create transaction with file succeeds
- [ ] Create transaction without file succeeds
- [ ] File upload validation works (reject .txt)
- [ ] File size validation works (reject > 5MB)
- [ ] Get all transactions returns array
- [ ] Update transaction works
- [ ] Delete transaction removes file
- [ ] Summary calculates correctly
- [ ] Error responses have proper status codes

---

## 🎓 Tips

1. **Save responses:** Postman dapat save example responses untuk reference
2. **Use variables:** Gunakan `{{transaction_id}}` untuk dynamic testing
3. **Test 順序:** Always test in order (CREATE → READ → UPDATE → DELETE)
4. **Check files:** Verify files di folder `backend/uploads/`
5. **Monitor logs:** Check terminal untuk error messages

**Status:** ✅ Ready untuk testing!
