import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import api from "../services/api";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const response = await api.getSummary();
      setSummary(response.data);
      setError(null);
    } catch (err) {
      setError("Gagal memuat data summary");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currency) => {
    if (currency === "IDR") {
      return `Rp ${amount.toLocaleString("id-ID")}`;
    }
    return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 10,
          font: { size: 11 },
        },
      },
    },
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

  const hasData = summary?.composition && summary.composition.length > 0;

  // Filter assets by currency
  const assetsIDR =
    summary?.assets?.filter((asset) => asset.currency === "IDR") || [];
  const assetsUSD =
    summary?.assets?.filter((asset) => asset.currency === "USD") || [];

  // Chart data generators
  const getChartData = (items, labelKey = "asset_type") => {
    if (!items || items.length === 0) return null;

    return {
      labels: items.map((item) => item[labelKey]),
      datasets: [
        {
          data: items.map((item) => item.total_spent),
          backgroundColor: [
            "#4f46e5",
            "#10b981",
            "#f59e0b",
            "#ef4444",
            "#8b5cf6",
            "#06b6d4",
            "#ec4899",
            "#84cc16",
          ],
          borderColor: "#ffffff",
          borderWidth: 2,
        },
      ],
    };
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link to="/add-transaction" className="btn btn-primary">
          + Tambah Transaksi
        </Link>
      </div>

      {/* Total Cards */}
      <div className="grid grid-cols-2" style={{ marginBottom: "2rem" }}>
        <div
          className="card"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <p
            style={{
              opacity: 0.9,
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
            }}
          >
            💵 Total Uang Keluar (IDR)
          </p>
          <p className="text-3xl font-bold">
            {formatCurrency(summary?.total_idr || 0, "IDR")}
          </p>
        </div>

        <div
          className="card"
          style={{
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            color: "white",
          }}
        >
          <p
            style={{
              opacity: 0.9,
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
            }}
          >
            💰 Total Uang Keluar (USD)
          </p>
          <p className="text-3xl font-bold">
            {formatCurrency(summary?.total_usd || 0, "USD")}
          </p>
        </div>
      </div>

      {!hasData ? (
        <div className="card text-center" style={{ padding: "3rem" }}>
          <p
            className="text-gray-600"
            style={{ fontSize: "1.125rem", marginBottom: "1rem" }}
          >
            Belum ada data transaksi
          </p>
          <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
            Mulai catat transaksi investasi Anda untuk melihat analytics
          </p>
          <Link to="/add-transaction" className="btn btn-primary">
            + Tambah Transaksi Pertama
          </Link>
        </div>
      ) : (
        <>
          {/* 2 Donut Charts - Assets Breakdown by Currency */}
          <div
            className="grid grid-cols-2"
            style={{ gap: "1.5rem", marginBottom: "2rem" }}
          >
            {/* Chart 1: Assets Breakdown IDR */}
            <div className="card">
              <h2
                className="text-xl font-bold"
                style={{ marginBottom: "0.5rem" }}
              >
                🎯 Aset yang Diinvestasikan (IDR)
              </h2>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  marginBottom: "1rem",
                }}
              >
                {assetsIDR.length} aset
              </p>
              <div style={{ height: "280px" }}>
                {assetsIDR.length > 0 ? (
                  <Doughnut
                    data={getChartData(assetsIDR, "asset_name")}
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        legend: {
                          ...chartOptions.plugins.legend,
                          position: "bottom" as const,
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              const asset = assetsIDR[context.dataIndex];
                              const total = assetsIDR.reduce(
                                (sum, a) => sum + a.total_spent,
                                0
                              );
                              const percentage =
                                total > 0
                                  ? ((asset.total_spent / total) * 100).toFixed(
                                      2
                                    )
                                  : 0;
                              return [
                                `${asset.asset_name}: ${formatCurrency(
                                  asset.total_spent,
                                  "IDR"
                                )} (${percentage}%)`,
                                `Qty: ${
                                  asset.total_quantity > 0
                                    ? asset.total_quantity.toLocaleString()
                                    : "-"
                                }`,
                                `${asset.transaction_count}x transaksi`,
                              ];
                            },
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      color: "#9ca3af",
                    }}
                  >
                    Belum ada aset IDR
                  </div>
                )}
              </div>
            </div>

            {/* Chart 4: Assets Breakdown USD */}
            <div className="card">
              <h2
                className="text-xl font-bold"
                style={{ marginBottom: "0.5rem" }}
              >
                🎯 Aset yang Diinvestasikan (USD)
              </h2>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  marginBottom: "1rem",
                }}
              >
                {assetsUSD.length} aset
              </p>
              <div style={{ height: "280px" }}>
                {assetsUSD.length > 0 ? (
                  <Doughnut
                    data={getChartData(assetsUSD, "asset_name")}
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        legend: {
                          ...chartOptions.plugins.legend,
                          position: "bottom" as const,
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              const asset = assetsUSD[context.dataIndex];
                              const total = assetsUSD.reduce(
                                (sum, a) => sum + a.total_spent,
                                0
                              );
                              const percentage =
                                total > 0
                                  ? ((asset.total_spent / total) * 100).toFixed(
                                      2
                                    )
                                  : 0;
                              return [
                                `${asset.asset_name}: ${formatCurrency(
                                  asset.total_spent,
                                  "USD"
                                )} (${percentage}%)`,
                                `Qty: ${
                                  asset.total_quantity > 0
                                    ? asset.total_quantity.toLocaleString()
                                    : "-"
                                }`,
                                `${asset.transaction_count}x transaksi`,
                              ];
                            },
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      color: "#9ca3af",
                    }}
                  >
                    Belum ada aset USD
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary Cards - 3 Column Grid */}
          <div
            className="grid grid-cols-3"
            style={{ gap: "1rem", marginBottom: "2rem" }}
          >
            {summary.composition.map((item, index) => (
              <div
                key={index}
                className="card"
                style={{
                  background:
                    index % 3 === 0
                      ? "#eff6ff"
                      : index % 3 === 1
                      ? "#f0fdf4"
                      : "#fef3f2",
                  border: `2px solid ${
                    index % 3 === 0
                      ? "#dbeafe"
                      : index % 3 === 1
                      ? "#dcfce7"
                      : "#fee2e2"
                  }`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#6b7280",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {item.asset_type} ({item.currency})
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{
                        color:
                          index % 3 === 0
                            ? "#1e40af"
                            : index % 3 === 1
                            ? "#065f46"
                            : "#991b1b",
                      }}
                    >
                      {formatCurrency(item.total_spent, item.currency)}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      {item.transaction_count} transaksi
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Table */}
          <div className="card">
            <h2 className="text-xl font-bold" style={{ marginBottom: "1rem" }}>
              📋 Detail Komposisi Aset
            </h2>
            <table>
              <thead>
                <tr>
                  <th>Tipe Aset</th>
                  <th>Currency</th>
                  <th>Total Spent</th>
                  <th>Jumlah Transaksi</th>
                  <th>Persentase</th>
                </tr>
              </thead>
              <tbody>
                {summary.composition.map((item, index) => {
                  const total =
                    item.currency === "IDR"
                      ? summary.total_idr
                      : summary.total_usd;
                  const percentage =
                    total > 0
                      ? ((item.total_spent / total) * 100).toFixed(2)
                      : 0;

                  return (
                    <tr key={index}>
                      <td>
                        <span
                          style={{
                            padding: "0.25rem 0.75rem",
                            borderRadius: "0.375rem",
                            fontSize: "0.875rem",
                            background:
                              item.asset_type === "IDX"
                                ? "#dbeafe"
                                : item.asset_type === "US"
                                ? "#d1fae5"
                                : "#e9d5ff",
                            color:
                              item.asset_type === "IDX"
                                ? "#1e40af"
                                : item.asset_type === "US"
                                ? "#065f46"
                                : "#6b21a8",
                          }}
                        >
                          {item.asset_type}
                        </span>
                      </td>
                      <td>{item.currency}</td>
                      <td style={{ fontWeight: 600 }}>
                        {formatCurrency(item.total_spent, item.currency)}
                      </td>
                      <td>{item.transaction_count} transaksi</td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <div
                            style={{
                              flex: 1,
                              height: "8px",
                              background: "#e5e7eb",
                              borderRadius: "4px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${percentage}%`,
                                height: "100%",
                                background: "#4f46e5",
                                borderRadius: "4px",
                              }}
                            ></div>
                          </div>
                          <span
                            style={{ fontSize: "0.875rem", fontWeight: 600 }}
                          >
                            {percentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
