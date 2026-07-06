import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPasswordApi } from "../api/authApi";
import styles from "../styles/loginStyles";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      setLoading(true);
      const response = await forgotPasswordApi(email.trim().toLowerCase());
      setMessage(response.message || "Хэрэв бүртгэлтэй и-мэйл бол сэргээх холбоос илгээгдлээ.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Хүсэлт илгээхэд алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper} className="auth-wrapper">
      <div style={styles.right} className="auth-right">
        <form style={styles.card} className="auth-card" onSubmit={handleSubmit}>
          <h2 style={styles.formTitle}>Нууц үг сэргээх</h2>
          <p style={styles.desc}>Бүртгэлтэй и-мэйл хаягаа оруулна уу.</p>
          <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="И-мэйл" style={styles.input} />
          {message && <div className="auth-success-message">{message}</div>}
          {error && <div className="auth-error-message">{error}</div>}
          <button type="submit" style={styles.button} disabled={loading}>{loading ? "Илгээж байна..." : "Сэргээх холбоос авах"}</button>
          <button type="button" style={styles.footerLink} onClick={() => navigate("/login")}>Нэвтрэх хэсэг рүү буцах</button>
        </form>
      </div>
    </div>
  );
}
