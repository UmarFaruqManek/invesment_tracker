import React from "react";
import { Link, useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6" }}>
      <nav>
        <div className="nav-content">
          <h1>💰 Investment Tracker</h1>
          <ul>
            <li>
              <Link to="/" className={isActive("/")}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/transactions" className={isActive("/transactions")}>
                Transaksi
              </Link>
            </li>
            <li>
              <Link
                to="/add-transaction"
                className={isActive("/add-transaction")}
              >
                Tambah Transaksi
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <main style={{ padding: "2rem 0" }}>
        <div className="container">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
