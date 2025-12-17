# 🎨 Frontend React - Komponen & Kode

## 📋 Struktur Kode

```
frontend/src/
├── components/
│   └── Layout.tsx           → Navigation bar & wrapper
├── pages/
│   ├── Dashboard.tsx        → Summary + Donut chart
│   ├── Transactions.tsx     → Table + Delete
│   └── AddTransaction.tsx   → Form + Upload
├── services/
│   └── api.ts               → Backend API calls
├── utils/
│   └── helpers.ts           → Format functions
├── App.tsx                  → Routes
└── main.tsx                 → Entry point
```

---

## 🔌 API Service (services/api.ts)

**Fungsi:** Centralized API calls ke backend

**Methods:**

- `getTransactions()` - Fetch semua transaksi
- `createTransaction(formData)` - POST dengan multipart/form-data
- `deleteTransaction(id)` - DELETE transaksi
- `getSummary()` - Fetch total & composition

**Features:**

- Auto error handling
- Axios interceptors ready
- Environment variable untuk base URL

---

## 🛠️ Utility Helpers (utils/helpers.ts)

### formatCurrency(amount)

```javascript
formatCurrency(850000);
// Output: "Rp 850.000"
```

### formatDate(dateString)

```javascript
formatDate("2025-12-17");
// Output: "17 Desember 2025"
```

### getAssetTypeLabel(type)

```javascript
getAssetTypeLabel("IDX");
// Output: "Saham Indonesia"
```

### getAssetTypeBadge(type)

```javascript
getAssetTypeBadge("IDX");
// Output: "bg-blue-100 text-blue-800"
```

---

## 🏗️ Layout Component

**Fungsi:** Wrapper dengan navigation bar

**Features:**

- Responsive navbar
- Active route highlighting
- 3 menu items: Dashboard, Transaksi, Tambah Transaksi
- Fixed max-width container (max-w-7xl)

---

## 📊 Dashboard Page

### Features:

1. **Total Spent Card**

   - Gradient background (indigo → purple)
   - Money icon
   - Large formatted number

2. **Composition Cards** (Grid 3 kolom)

   - Per asset type (IDX, US, CRYPTO)
   - Shows: Total spent, transaction count, percentage
   - Color-coded backgrounds

3. **Donut Chart**
   - Chart.js Doughnut
   - Legend at bottom
   - Tooltip dengan formatted currency
   - Empty state jika belum ada data

### State Management:

- `summary` - Data dari GET /api/summary
- `loading` - Loading state
- `error` - Error handling

### Auto-refresh:

- useEffect on mount

---

## 📋 Transactions Page

### Features:

1. **Table Columns:**

   - Tanggal (formatted)
   - Nama Aset
   - Tipe (badge)
   - Quantity
   - Harga/Unit
   - Total (bold)
   - Bukti (icon link)
   - Aksi (delete button)

2. **Delete Functionality:**

   - Confirmation dialog
   - Loading state per row
   - Auto-refresh list after delete

3. **Footer Summary:**
   - Total transactions count
   - Grand total spent

### Empty State:

- Icon placeholder
- Call-to-action button

---

## ➕ AddTransaction Page

### Form Fields:

1. **Asset Name** (text) - Required
2. **Asset Type** (select) - IDX/US/CRYPTO
3. **Quantity** (number) - Decimal support
4. **Price per Unit** (number)
5. **Date** (date picker) - Required
6. **Proof** (file) - Optional

### Features:

1. **Auto-calculated Total**

   - Real-time calculation: quantity × price
   - Displayed in blue card

2. **File Upload:**

   - Drag & drop area
   - Image preview (untuk JPEG/PNG)
   - File name display (untuk PDF)
   - Remove button
   - Max 5MB validation

3. **Submit:**
   - FormData untuk multipart
   - Loading spinner
   - Success → redirect to /transactions
   - Error → alert message

### Validation:

- Required fields check
- Auto client-side validation (HTML5)

---

## 🎨 UI Design Principles

### Colors:

- **Primary:** Indigo (indigo-600, indigo-700)
- **IDX:** Blue (blue-100, blue-800)
- **US:** Green (green-100, green-800)
- **CRYPTO:** Purple (purple-100, purple-800)
- **Danger:** Red (red-600, red-900)

### Spacing:

- Container: `max-w-7xl mx-auto`
- Padding: `px-4 py-6`
- Gap: `space-y-6`, `gap-6`

### Shadows:

- Cards: `shadow-md`, `shadow-lg`
- Buttons: `shadow-sm`

### Responsive:

- Grid: `grid-cols-1 md:grid-cols-3`
- Padding: `px-4 sm:px-6 lg:px-8`

---

## 🚦 Routing (App.tsx)

```jsx
<Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/transactions" element={<Transactions />} />
  <Route path="/add-transaction" element={<AddTransaction />} />
</Routes>
```

**All routes** wrapped in `<Layout>`

---

## 🧪 Testing Flow

### Manual Test:

1. ✅ Start frontend: `npm run dev`
2. ✅ Start backend: `npm run dev` (port 5000)
3. ✅ Open http://localhost:5173
4. ✅ Check Dashboard loads (empty state OK)
5. ✅ Click "Tambah Transaksi"
6. ✅ Fill form + upload file
7. ✅ Submit → redirect to Transactions
8. ✅ Verify new transaction in table
9. ✅ Click eye icon → bukti opens
10. ✅ Click delete → confirm → gone
11. ✅ Back to Dashboard → chart updated

---

## 📝 Contoh Data Flow

### CREATE Transaction:

```
User fills form
  ↓
FormData created
  ↓
api.createTransaction(formData)
  ↓
POST /api/transactions (multipart)
  ↓
Backend saves file + DB record
  ↓
Response: { success: true, data: {...} }
  ↓
Navigate to /transactions
  ↓
Table auto-loads new data
```

### DELETE Transaction:

```
User clicks delete
  ↓
Confirm dialog
  ↓
api.deleteTransaction(id)
  ↓
DELETE /api/transactions/:id
  ↓
Backend deletes file + DB record
  ↓
Frontend filters out deleted item
  ↓
Table re-renders
```

---

## 📚 Key Files

- [App.tsx](file:///d:/APLIKASI%20PENCATATAN%20ASET%20PRIBADI/frontend/src/App.tsx)
- [Dashboard.tsx](file:///d:/APLIKASI%20PENCATATAN%20ASET%20PRIBADI/frontend/src/pages/Dashboard.tsx)
- [Transactions.tsx](file:///d:/APLIKASI%20PENCATATAN%20ASET%20PRIBADI/frontend/src/pages/Transactions.tsx)
- [AddTransaction.tsx](file:///d:/APLIKASI%20PENCATATAN%20ASET%20PRIBADI/frontend/src/pages/AddTransaction.tsx)
- [api.ts](file:///d:/APLIKASI%20PENCATATAN%20ASET%20PRIBADI/frontend/src/services/api.ts)
- [helpers.ts](file:///d:/APLIKASI%20PENCATATAN%20ASET%20PRIBADI/frontend/src/utils/helpers.ts)

**Status:** ✅ Frontend complete dan ready!
