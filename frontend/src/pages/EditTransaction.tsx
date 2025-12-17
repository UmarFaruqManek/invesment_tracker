import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const EditTransaction = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    asset_name: "",
    asset_type: "IDX",
    quantity: "",
    price_per_unit: "",
    total_spent: "",
    currency: "IDR",
    date: "",
  });
  const [file, setFile] = useState(null);
  const [currentProof, setCurrentProof] = useState(null);

  useEffect(() => {
    loadTransaction();
  }, [id]);

  const loadTransaction = async () => {
    try {
      setFetchLoading(true);
      const response = await api.getTransactionById(id);
      const transaction = response.data;

      setFormData({
        asset_name: transaction.asset_name || "",
        asset_type: transaction.asset_type || "IDX",
        quantity: transaction.quantity || "",
        price_per_unit: transaction.price_per_unit || "",
        total_spent: transaction.total_spent || "",
        currency: transaction.currency || "IDR",
        date: transaction.date || "",
      });
      setCurrentProof(transaction.proof_path);
    } catch (err) {
      alert("Gagal memuat data transaksi");
      console.error(err);
      navigate("/transactions");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const calculateTotal = () => {
    const qty = parseFloat(formData.quantity) || 0;
    const price = parseFloat(formData.price_per_unit) || 0;
    const total = qty * price;
    setFormData((prev) => ({
      ...prev,
      total_spent: total > 0 ? total.toString() : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.asset_name || !formData.date) {
      alert("Silakan isi Nama Aset dan Tanggal");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("asset_name", formData.asset_name);
      data.append("asset_type", formData.asset_type);
      data.append("quantity", formData.quantity || "0");
      data.append("price_per_unit", formData.price_per_unit || "0");
      data.append("total_spent", formData.total_spent || "0");
      data.append("currency", formData.currency);
      data.append("date", formData.date);

      if (file) {
        data.append("proof", file);
      }

      await api.updateTransaction(id, data);
      alert("Transaksi berhasil diupdate!");
      navigate("/transactions");
    } catch (err) {
      alert(
        "Gagal mengupdate transaksi: " +
          (err.response?.data?.message || err.message)
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1 className="text-3xl font-bold" style={{ marginBottom: "0.5rem" }}>
        Edit Transaksi
      </h1>
      <p className="text-gray-600" style={{ marginBottom: "2rem" }}>
        Update data transaksi pembelian aset
      </p>

      <form onSubmit={handleSubmit} className="card">
        {/* Asset Name */}
        <div className="form-group">
          <label className="form-label">
            Nama Aset <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="asset_name"
            value={formData.asset_name}
            onChange={handleInputChange}
            placeholder="Contoh: BBCA, AAPL, BTC"
            className="form-input"
            required
          />
        </div>

        {/* Asset Type */}
        <div className="form-group">
          <label className="form-label">
            Tipe Aset <span style={{ color: "red" }}>*</span>
          </label>
          <select
            name="asset_type"
            value={formData.asset_type}
            onChange={handleInputChange}
            className="form-select"
            required
          >
            <option value="IDX">Saham Indonesia (IDX)</option>
            <option value="US">Saham US</option>
            <option value="CRYPTO">Cryptocurrency</option>
          </select>
        </div>

        {/* Quantity and Price */}
        <div className="grid grid-cols-2">
          <div className="form-group">
            <label className="form-label">Quantity (Jumlah)</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              step="0.00000001"
              placeholder="100"
              className="form-input"
            />
            <p
              style={{
                fontSize: "0.75rem",
                color: "#6b7280",
                marginTop: "0.25rem",
              }}
            >
              Jumlah saham/coin yang dibeli
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Price (Harga per Unit)</label>
            <input
              type="number"
              name="price_per_unit"
              value={formData.price_per_unit}
              onChange={handleInputChange}
              step="0.01"
              placeholder="8500"
              className="form-input"
            />
            <p
              style={{
                fontSize: "0.75rem",
                color: "#6b7280",
                marginTop: "0.25rem",
              }}
            >
              Harga per lembar saat beli
            </p>
          </div>
        </div>

        {/* Auto Calculate Button */}
        {formData.quantity && formData.price_per_unit && (
          <div style={{ marginBottom: "1rem" }}>
            <button
              type="button"
              onClick={calculateTotal}
              className="btn btn-secondary"
              style={{ fontSize: "0.875rem" }}
            >
              🧮 Hitung Total Otomatis (Quantity × Price)
            </button>
          </div>
        )}

        {/* Total Spent and Currency */}
        <div className="grid grid-cols-2">
          <div className="form-group">
            <label className="form-label">Total Spent</label>
            <input
              type="number"
              name="total_spent"
              value={formData.total_spent}
              onChange={handleInputChange}
              step="0.01"
              placeholder="850000"
              className="form-input"
            />
            <p
              style={{
                fontSize: "0.75rem",
                color: "#6b7280",
                marginTop: "0.25rem",
              }}
            >
              Total uang yang dikeluarkan
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">
              Currency <span style={{ color: "red" }}>*</span>
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="IDR">Rupiah (IDR)</option>
              <option value="USD">Dollar (USD)</option>
            </select>
          </div>
        </div>

        {/* Date */}
        <div className="form-group">
          <label className="form-label">
            Tanggal Pembelian <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>

        {/* Current Proof */}
        {currentProof && (
          <div className="form-group">
            <label className="form-label">Bukti Pembelian Saat Ini</label>
            <div style={{ marginTop: "0.5rem" }}>
              <a
                href={`http://localhost:5000${currentProof}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#4f46e5", textDecoration: "underline" }}
              >
                Lihat bukti saat ini
              </a>
            </div>
          </div>
        )}

        {/* File Upload */}
        <div className="form-group">
          <label className="form-label">
            {currentProof
              ? "Ganti Bukti Pembelian (Opsional)"
              : "Bukti Pembelian (Opsional)"}
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*,.pdf"
            className="form-input"
          />
          <p
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
              marginTop: "0.5rem",
            }}
          >
            {currentProof
              ? "Upload file baru untuk mengganti bukti yang lama"
              : "Format: JPG, PNG, PDF (max 5MB)"}
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <button
            type="button"
            onClick={() => navigate("/transactions")}
            className="btn btn-secondary"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ opacity: loading ? 0.5 : 1 }}
          >
            {loading ? "Menyimpan..." : "Update Transaksi"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTransaction;
