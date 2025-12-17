# 🚀 Deployment & Running Guide

## 📋 Table of Contents

1. [Cara Run Frontend & Backend Bersamaan](#cara-run-bersamaan)
2. [Deploy ke Local Server (XAMPP/MySQL)](#deploy-local-server)
3. [Validasi & Security](#validasi)
4. [Troubleshooting](#troubleshooting)

---

## 1️⃣ Cara Run Frontend & Backend Bersamaan

### Method 1: Dua Terminal (Recommended)

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

Output:

```
Server running on port 5000
Static files served at: http://localhost:5000/uploads
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Output:

```
VITE v7.3.0  ready in 188 ms
➜  Local:   http://localhost:5173/
```

**Akses Aplikasi:**

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Uploads: http://localhost:5000/uploads

---

### Method 2: Using npm-run-all (Optional)

**Install concurrently:**

```bash
npm install -g concurrently
```

**Buat script di root `package.json`:**

```json
{
  "scripts": {
    "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm run dev\""
  }
}
```

**Run:**

```bash
npm run dev
```

---

### Method 3: PowerShell Script (Windows)

Buat file `start.ps1` di root folder:

```powershell
# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Wait 3 seconds
Start-Sleep -Seconds 3

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "Backend: http://localhost:5000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
```

**Run:**

```bash
.\start.ps1
```

---

## 2️⃣ Deploy ke Local Server (XAMPP/MySQL)

### A. Setup Database dengan XAMPP

#### Step 1: Install XAMPP

1. Download XAMPP dari https://www.apachefriends.org/
2. Install XAMPP
3. Start Apache & MySQL dari XAMPP Control Panel

#### Step 2: Buat Database

1. Buka http://localhost/phpmyadmin
2. Click "New" untuk buat database baru
3. Nama database: `investment_tracker`
4. Collation: `utf8mb4_general_ci`
5. Click "Create"

#### Step 3: Import Schema

**Method A - GUI:**

1. Pilih database `investment_tracker`
2. Click tab "Import"
3. Choose file: `backend/database.sql`
4. Click "Go"

**Method B - Command Line:**

```bash
# Navigate ke XAMPP mysql bin
cd C:\xampp\mysql\bin

# Import database
.\mysql -u root -p investment_tracker < "D:\APLIKASI PENCATATAN ASET PRIBADI\backend\database.sql"
```

#### Step 4: Configure Backend `.env`

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=investment_tracker
```

> **Note:** Default XAMPP MySQL tidak ada password. Jika Anda set password, isi di `DB_PASSWORD`

---

### B. Setup Node.js Server

#### Production Mode

**Backend:**

```bash
cd backend
npm start
```

**Frontend:**

```bash
cd frontend
npm run build
npm run preview
```

---

### C. Deploy dengan PM2 (Process Manager)

**Install PM2:**

```bash
npm install -g pm2
```

**Start Backend:**

```bash
cd backend
pm2 start server.js --name "investment-backend"
```

**Start Frontend:**

```bash
cd frontend
pm2 serve dist 5173 --name "investment-frontend"
```

**PM2 Commands:**

```bash
pm2 list              # List all processes
pm2 logs              # View logs
pm2 restart all       # Restart all
pm2 stop all          # Stop all
pm2 delete all        # Delete all
```

**Auto-start on boot:**

```bash
pm2 startup
pm2 save
```

---

## 3️⃣ Validasi & Security

### File Upload Validation

**Already Implemented:**

#### ✅ File Type Validation

```javascript
// backend/middleware/upload.js
const allowedTypes = /jpeg|jpg|png|pdf/;
```

**Allowed:**

- `.jpg`, `.jpeg` - JPEG images
- `.png` - PNG images
- `.pdf` - PDF documents

**Rejected:**

- `.txt`, `.doc`, `.docx`, `.exe`, etc.

**Error Message:**

```
"Hanya file gambar (JPEG, JPG, PNG) dan PDF yang diizinkan!"
```

---

#### ✅ File Size Validation

```javascript
// backend/middleware/upload.js
limits: {
  fileSize: 5 * 1024 * 1024;
} // 5MB
```

**Maximum Size:** 5MB

**Error Message:**

```
"File terlalu besar. Maksimal 5MB"
```

---

#### ✅ Filename Sanitization

```javascript
// Auto-generated unique filename
filename: nameWithoutExt + "-" + timestamp + "-" + random + ext;
```

**Example:** `bukti-1734567890123-456789.jpg`

**Benefits:**

- Prevent name collision
- Prevent path traversal attacks
- Trackable by timestamp

---

### Input Validation

**Already Implemented:**

#### Required Fields Validation

```javascript
// backend/controllers/transactionController.js
if (!asset_name || !asset_type || !quantity || !price_per_unit || !date) {
  return res.status(400).json({
    success: false,
    message: "Semua field wajib diisi",
  });
}
```

---

#### Asset Type Validation

```javascript
const validAssetTypes = ["IDX", "US", "CRYPTO"];
if (!validAssetTypes.includes(asset_type)) {
  return res.status(400).json({
    success: false,
    message: "asset_type harus salah satu dari: IDX, US, CRYPTO",
  });
}
```

---

### Additional Security Recommendations

#### 1. Environment Variables

**Never commit `.env` file!**  
✅ Already in `.gitignore`

#### 2. CORS Configuration

```javascript
// backend/server.js
// For production, specify allowed origins:
app.use(
  cors({
    origin: "http://your-frontend-domain.com",
  })
);
```

#### 3. Database Connection

✅ Using connection pooling  
✅ Using prepared statements (prevents SQL injection)

#### 4. File Storage

- Uploaded files stored in `backend/uploads/`
- Served as static files (read-only)
- Original filenames not exposed

---

## 4️⃣ Troubleshooting

### Problem: Backend tidak connect ke MySQL

**Solution:**

1. Check XAMPP MySQL is running
2. Verify `.env` credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=investment_tracker
   ```
3. Test connection:
   ```bash
   mysql -u root -p
   USE investment_tracker;
   SHOW TABLES;
   ```

---

### Problem: Frontend tidak bisa akses API

**Solution:**

1. Check backend server running di port 5000
2. Verify `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
3. Check CORS enabled di backend
4. Check browser console for errors

---

### Problem: File upload tidak berhasil

**Solution:**

1. Check folder `backend/uploads/` exists
2. Check file size < 5MB
3. Check file type (jpg, png, pdf only)
4. Check permissions:
   ```bash
   # Windows
   icacls uploads /grant Users:F
   ```

---

### Problem: Port already in use

**Backend (Port 5000):**

```bash
# Find process
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F
```

**Frontend (Port 5173):**

```bash
# Find process
netstat -ano | findstr :5173

# Kill process
taskkill /PID <PID> /F
```

---

### Problem: Database table tidak ada

**Solution:**

```bash
# Re-import schema
mysql -u root -p investment_tracker < backend/database.sql
```

---

### Problem: npm install error

**Solution:**

```bash
# Clear cache
npm cache clean --force

# Delete node_modules & package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

## 📊 Health Check Endpoints

### Backend Health

```bash
curl http://localhost:5000/api/health
```

Expected:

```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### Frontend

Open browser: http://localhost:5173

Expected: Dashboard page loads

### Database

```bash
mysql -u root -p
USE investment_tracker;
SELECT COUNT(*) FROM transactions;
```

---

## 🎯 Production Checklist

- [ ] Database created & schema imported
- [ ] `.env` files configured
- [ ] `node_modules` installed (backend & frontend)
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] MySQL/XAMPP running
- [ ] File uploads working
- [ ] CORS configured
- [ ] Error handling tested
- [ ] Logs monitored

---

**Status:** ✅ Ready untuk production!
