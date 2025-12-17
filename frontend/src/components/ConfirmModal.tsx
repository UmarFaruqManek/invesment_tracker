import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  isDanger = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onCancel}
    >
      <div
        className="card"
        style={{
          maxWidth: "500px",
          width: "90%",
          padding: "2rem",
          animation: "slideIn 0.2s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{ marginBottom: "1rem", fontSize: "1.5rem", fontWeight: 700 }}
        >
          {title}
        </h2>
        <p style={{ marginBottom: "2rem", color: "#6b7280", lineHeight: 1.6 }}>
          {message}
        </p>
        <div
          style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}
        >
          <button
            onClick={onCancel}
            className="btn"
            style={{
              background: "#f3f4f6",
              color: "#374151",
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`btn ${isDanger ? "btn-danger" : "btn-primary"}`}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ConfirmModal;
