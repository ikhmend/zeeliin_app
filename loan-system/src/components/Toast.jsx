import { useEffect } from "react";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;
  const success = toast.type === "success";

  return (
    <div
      role="status"
      style={{
        ...styles.toast,
        borderColor: success ? "#86efac" : "#fecaca",
        background: success ? "#dcfce7" : "#fef2f2",
        color: success ? "#166534" : "#b91c1c",
      }}
    >
      <span>{toast.message}</span>
      <button type="button" onClick={onClose} style={styles.close} aria-label="Хаах">×</button>
    </div>
  );
}

const styles = {
  toast: {
    position: "fixed",
    bottom: 24,
    right: 24,
    zIndex: 1100,
    display: "flex",
    alignItems: "center",
    gap: 10,
    maxWidth: 380,
    padding: "12px 14px",
    border: "1px solid",
    borderRadius: 10,
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.14)",
    fontSize: 14,
    fontWeight: 600,
  },
  close: { marginLeft: 8, border: 0, background: "transparent", color: "inherit", cursor: "pointer", fontSize: 20, lineHeight: 1 },
};
