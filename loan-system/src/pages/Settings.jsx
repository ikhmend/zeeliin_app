import { useState } from "react";
import { changePasswordApi } from "../api/authApi";

export default function Settings({ onLogout }) {
  const [form, setForm] = useState({ currentPass: "", newPass: "", confirmPass: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!/[a-z]/.test(form.newPass) || !/[A-Z]/.test(form.newPass) || !/\d/.test(form.newPass)) return setError("Шинэ нууц үг том, жижиг үсэг болон тоо агуулна.");
    if (form.newPass !== form.confirmPass) return setError("Шинэ нууц үгнүүд таарахгүй байна.");
    if (form.currentPass === form.newPass) return setError("Шинэ нууц үг хуучин нууц үгээс өөр байна.");
    try {
      setLoading(true);
      await changePasswordApi(form);
      setForm({ currentPass: "", newPass: "", confirmPass: "" });
      setMessage("Нууц үг солигдлоо. Дахин нэвтэрнэ үү.");
      setTimeout(() => onLogout?.(), 1200);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.response?.data?.error || "Нууц үг солиход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container} className="page-container">
      <form style={styles.card} className="section-card" onSubmit={handleSubmit}>
        <h2 style={styles.title}>Нууц үг солих</h2>
        <label style={styles.label} htmlFor="currentPass">Одоогийн нууц үг</label>
        <input id="currentPass" type="password" required value={form.currentPass} onChange={(event) => setForm({...form, currentPass: event.target.value})} style={styles.input} />
        <label style={styles.label} htmlFor="newPass">Шинэ нууц үг</label>
        <input id="newPass" type="password" required minLength="8" maxLength="72" value={form.newPass} onChange={(event) => setForm({...form, newPass: event.target.value})} style={styles.input} />
        <label style={styles.label} htmlFor="confirmPass">Шинэ нууц үг давтах</label>
        <input id="confirmPass" type="password" required minLength="8" maxLength="72" value={form.confirmPass} onChange={(event) => setForm({...form, confirmPass: event.target.value})} style={styles.input} />
        {message && <div style={styles.success}>{message}</div>}
        {error && <div style={styles.error}>{error}</div>}
        <button type="submit" disabled={loading} style={styles.button}>{loading ? "Сольж байна..." : "Нууц үг солих"}</button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: 640, margin: "0 auto", padding: "24px 16px" },
  card: { display: "flex", flexDirection: "column", padding: 24, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12 },
  title: { margin: "0 0 20px", color: "#0f172a" },
  label: { marginBottom: 6, color: "#475569", fontSize: 14, fontWeight: 600 },
  input: { height: 42, marginBottom: 16, padding: "0 12px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 15 },
  button: { padding: "12px 16px", border: 0, borderRadius: 8, background: "#111827", color: "#fff", fontWeight: 700, cursor: "pointer" },
  success: { marginBottom: 14, padding: 12, borderRadius: 8, background: "#dcfce7", color: "#15803d" },
  error: { marginBottom: 14, padding: 12, borderRadius: 8, background: "#fee2e2", color: "#b91c1c" },
};
