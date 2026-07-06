import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordApi } from "../api/authApi";
import styles from "../styles/loginStyles";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = params.get("token") || "";

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) return setError("Сэргээх холбоос буруу байна.");
    if (newPassword !== confirmPassword) return setError("Нууц үгнүүд таарахгүй байна.");
    try {
      setLoading(true);
      setError("");
      await resetPasswordApi({ token, newPassword, confirmPassword });
      navigate("/login", { replace: true, state: { passwordReset: true } });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Нууц үг шинэчлэхэд алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper} className="auth-wrapper">
      <div style={styles.right} className="auth-right">
        <form style={styles.card} className="auth-card" onSubmit={handleSubmit}>
          <h2 style={styles.formTitle}>Шинэ нууц үг</h2>
          <input type="password" required minLength="8" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="Шинэ нууц үг" style={styles.input} />
          <input type="password" required minLength="8" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Нууц үг давтах" style={styles.input} />
          {error && <div className="auth-error-message">{error}</div>}
          <button type="submit" style={styles.button} disabled={loading || !token}>{loading ? "Шинэчилж байна..." : "Нууц үг шинэчлэх"}</button>
        </form>
      </div>
    </div>
  );
}
