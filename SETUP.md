# Setup Instructions

Follow these steps to set up and run the Personal Investment Tracker application.

## Prerequisites

- Node.js v18 or higher
- npm (comes with Node.js)

## Quick Start

### 1. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### 2. Configure Environment

#### Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
```

#### Frontend Environment

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Create Required Folders

```bash
# In backend directory
mkdir -p uploads/bukti-pembelian
mkdir -p data
```

### 4. Initialize Database

```bash
cd backend/data
cp transactions.example.json transactions.json
```

### 5. Run the Application

Open **2 terminal windows**:

**Terminal 1 - Backend**:

```bash
cd backend
npm run dev
```

Server will run at `http://localhost:5000`

**Terminal 2 - Frontend**:

```bash
cd frontend
npm run dev
```

Frontend will run at `http://localhost:5173`

### 6. Access the Application

Open your browser and go to:

```
http://localhost:5173
```

## Verification

After setup, you should be able to:

1. ✅ See the dashboard (might be empty initially)
2. ✅ Add a new transaction
3. ✅ Upload proof of purchase (image/PDF)
4. ✅ View the transaction in the list
5. ✅ See the dashboard updated with charts

## Troubleshooting

### Port Already in Use

If you get "port already in use" error:

**For Backend**:

- Change `PORT` in `backend/.env` to another port (e.g., 5001)
- Update `VITE_API_URL` in `frontend/.env` accordingly

**For Frontend**:
Vite will automatically use another port if 5173 is busy.

### Upload Folder Errors

Make sure the folders exist:

```bash
cd backend
mkdir -p uploads/bukti-pembelian
mkdir -p data
```

### CORS Errors

Make sure:

1. Backend is running
2. `VITE_API_URL` in `frontend/.env` matches your backend URL

## Next Steps

After successful setup:

1. Read [README.md](../README.md) for features overview
2. Check [API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md) for API details
3. See [TESTING_GUIDE.md](../TESTING_GUIDE.md) for testing instructions

Happy tracking! 📈
