import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.getTransactions();
      setTransactions(response.data);
      setError(null);
    } catch (err) {
      setError("Gagal memuat data transaksi");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      return;
    }

    try {
      setDeleteLoading(id);
      await api.deleteTransaction(id);
      setTransactions(transactions.filter((t) => t.id !== id));
      alert("Transaksi berhasil dihapus");
    } catch (err) {
      alert("Gagal menghapus transaksi");
      console.error(err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatCurrency = (amount, currency) => {
    if (currency === "IDR") {
      return `Rp ${amount.toLocaleString("id-ID")}`;
    }
    return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="card"
        style={{ background: "#fee", color: "#c00", padding: "1rem" }}
      >
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 className="text-3xl font-bold">Daftar Transaksi</h1>
        <Link to="/add-transaction" className="btn btn-primary">
          + Tambah Transaksi
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="card text-center" style={{ padding: "3rem" }}>
          <p className="text-gray-600" style={{ marginBottom: "1rem" }}>
            Belum ada transaksi
          </p>
          <Link to="/add-transaction" className="btn btn-primary">
            Tambah Transaksi
          </Link>
        </div>
      ) : (
        <>
          <div className="card" style={{ padding: 0, overflow: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Aset</th>
                  <th>Tipe</th>
                  <th>Quantity</th>
                  <th>Price/Unit</th>
                  <th>Total Spent</th>
                  <th>Currency</th>
                  <th>Bukti</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{formatDate(transaction.date)}</td>
                    <td style={{ fontWeight: 600 }}>
                      {transaction.asset_name}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          borderRadius: "0.375rem",
                          fontSize: "0.875rem",
                          background:
                            transaction.asset_type === "IDX"
                              ? "#dbeafe"
                              : transaction.asset_type === "US"
                              ? "#d1fae5"
                              : "#e9d5ff",
                          color:
                            transaction.asset_type === "IDX"
                              ? "#1e40af"
                              : transaction.asset_type === "US"
                              ? "#065f46"
                              : "#6b21a8",
                        }}
                      >
                        {transaction.asset_type}
                      </span>
                    </td>
                    <td>{transaction.quantity || "-"}</td>
                    <td>
                      {transaction.price_per_unit
                        ? formatCurrency(
                            transaction.price_per_unit,
                            transaction.currency
                          )
                        : "-"}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {formatCurrency(
                        transaction.total_spent,
                        transaction.currency
                      )}
                    </td>
                    <td>{transaction.currency}</td>
                    <td>
                      {transaction.proof_path ? (
                        <a
                          href={`http://localhost:5000${transaction.proof_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#4f46e5" }}
                        >
                          Lihat
                        </a>
                      ) : (
                        <span style={{ color: "#9ca3af" }}>-</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        disabled={deleteLoading === transaction.id}
                        className="btn btn-danger"
                        style={{
                          padding: "0.25rem 0.75rem",
                          fontSize: "0.875rem",
                        }}
                      >
                        {deleteLoading === transaction.id ? "..." : "Hapus"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            className="card"
            style={{ marginTop: "1rem", background: "#eff6ff" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: 600 }}>
                Total {transactions.length} transaksi
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Transactions;
