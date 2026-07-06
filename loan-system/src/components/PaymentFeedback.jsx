export default function PaymentFeedback({ feedback, onClose }) {
  if (!feedback) return null;
  const success = feedback.type === "success";
  return (
    <div style={styles.backdrop} role="presentation" onClick={onClose}>
      <section style={styles.card} role="alertdialog" aria-modal="true" aria-labelledby="payment-feedback-title" onClick={(event) => event.stopPropagation()}>
        <div style={{ ...styles.icon, background: success ? "#dcfce7" : "#fee2e2", color: success ? "#15803d" : "#b91c1c" }}>
          {success ? "✓" : "!"}
        </div>
        <h3 id="payment-feedback-title" style={styles.title}>{feedback.title}</h3>
        <p style={styles.message}>{feedback.message}</p>
        {feedback.details && (
          <dl style={styles.details}>
            {feedback.details.map(({ label, value }) => (
              <div style={styles.row} key={label}>
                <dt style={styles.label}>{label}</dt>
                <dd style={styles.value}>{value}</dd>
              </div>
            ))}
          </dl>
        )}
        <button type="button" style={styles.button} onClick={onClose}>Хаах</button>
      </section>
    </div>
  );
}

const styles = {
  backdrop: { position: "fixed", inset: 0, zIndex: 1000, display: "grid", placeItems: "center", padding: 20, background: "rgba(15, 23, 42, 0.55)" },
  card: { width: "min(420px, 100%)", boxSizing: "border-box", padding: 28, borderRadius: 18, background: "#fff", boxShadow: "0 24px 60px rgba(15, 23, 42, 0.25)", textAlign: "center" },
  icon: { width: 52, height: 52, margin: "0 auto 14px", display: "grid", placeItems: "center", borderRadius: "50%", fontSize: 28, fontWeight: 800 },
  title: { margin: "0 0 8px", color: "#0f172a" },
  message: { margin: "0 0 18px", color: "#475569", lineHeight: 1.5 },
  details: { margin: "0 0 20px", padding: 14, borderRadius: 10, background: "#f8fafc", textAlign: "left" },
  row: { display: "flex", justifyContent: "space-between", gap: 16, padding: "5px 0" },
  label: { color: "#64748b" },
  value: { margin: 0, color: "#0f172a", fontWeight: 700, textAlign: "right" },
  button: { width: "100%", padding: "11px 16px", border: 0, borderRadius: 9, background: "#1d4ed8", color: "#fff", cursor: "pointer", fontWeight: 700 },
};
