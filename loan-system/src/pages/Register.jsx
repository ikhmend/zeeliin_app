import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/loginStyles";
import { registerUser } from "../services/authService";

const initialForm = {
  last_name: "",
  first_name: "",
  register_no: "",
  birth_date: "",
  phone: "",
  email: "",
};

const fieldLabels = {
  last_name: "Овог",
  first_name: "Нэр",
  register_no: "Регистрийн дугаар",
  birth_date: "Төрсөн огноо",
  phone: "Утасны дугаар",
  email: "И-мэйл",
};

const fields = [
  ["last_name", "Овог", "text", "Бат", "half"],
  ["first_name", "Нэр", "text", "Дорж", "half"],
  ["register_no", "Регистрийн дугаар", "text", "АА12345678", "half"],
  ["birth_date", "Төрсөн огноо", "date", "", "half"],
  ["phone", "Утасны дугаар", "tel", "99112233", "half"],
  ["email", "И-мэйл", "email", "name@example.com", "half"],
];

function validate(form) {
  const errors = {};
  for (const [name] of fields) {
    if (!form[name].trim()) errors[name] = `${fieldLabels[name]} оруулна уу.`;
  }
  if (form.register_no && !/^[А-ЯӨҮЁA-Z]{2}\d{8}$/.test(form.register_no.trim().toUpperCase())) {
    errors.register_no = "Жишээ: АА12345678";
  }
  if (form.phone && !/^\d{8}$/.test(form.phone.trim())) errors.phone = "Утасны дугаар 8 оронтой байна.";
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "И-мэйл формат буруу байна.";
  return errors;
}

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setGeneralError("");

    const nextErrors = validate(form);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    try {
      setLoading(true);
      await registerUser({
        last_name: form.last_name.trim(),
        first_name: form.first_name.trim(),
        register_no: form.register_no.trim().toUpperCase(),
        birth_date: form.birth_date,
        phone: form.phone.trim(),
        email: form.email.trim().toLowerCase(),
      });
      navigate("/login", { state: { registered: true, email: form.email.trim().toLowerCase() } });
    } catch (err) {
      const field = err.response?.data?.field?.replace("body.", "");
      const message = err.response?.data?.message || err.response?.data?.error || "Бүртгүүлэхэд алдаа гарлаа.";
      if (field && fieldLabels[field]) setErrors((prev) => ({ ...prev, [field]: message }));
      else setGeneralError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={registerPage} className="auth-wrapper">
      <div style={registerShell} className="auth-card">
        <form style={registerCard} onSubmit={handleRegister} noValidate>
          <div style={styles.logoRow}>
            <span style={styles.logoIcon}>LC</span> Зээлийн систем
          </div>
          <h2 style={styles.formTitle}>Бүртгүүлэх</h2>
          <p style={hintStyle}>Мэдээллээ оруулсны дараа и-мэйлээр нууц үг үүсгэх холбоос очно.</p>
          {generalError && <div className="auth-error-message">{generalError}</div>}

          <div style={fieldGrid} className="register-field-grid">
            {fields.map(([name, label, type, placeholder, size]) => (
            <div key={name} style={size === "half" ? fieldHalf : fieldWrap}>
              <label htmlFor={name} style={labelStyle}>{label}</label>
              <input
                id={name}
                name={name}
                type={type}
                value={form[name]}
                placeholder={placeholder}
                onChange={(event) => setField(name, event.target.value)}
                style={{ ...styles.input, marginBottom: 0, borderColor: errors[name] ? "#ef4444" : "#e2e8f0" }}
              />
              {errors[name] && <div style={errorStyle}>{errors[name]}</div>}
            </div>
          ))}
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
          </button>

          <p style={styles.footer}>
            Бүртгэлтэй юу?
            <span style={styles.footerLink} onClick={() => navigate("/login")}>Нэвтрэх</span>
          </p>
        </form>
      </div>
    </div>
  );
}

const registerPage = {
  width: "100%",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "32px 16px",
  background: "#f8fafc",
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};
const registerShell = { width: "100%", maxWidth: "760px" };
const registerCard = {
  width: "100%",
  padding: "28px",
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  boxShadow: "0 8px 30px rgba(15, 23, 42, 0.06)",
};
const hintStyle = { margin: "-20px 0 22px", color: "#64748b", fontSize: "14px", lineHeight: 1.5 };
const fieldGrid = { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", columnGap: "14px" };
const fieldWrap = { width: "100%", marginBottom: "14px" };
const fieldHalf = { ...fieldWrap, minWidth: 0 };
const labelStyle = { display: "block", marginBottom: "6px", fontSize: "13px", color: "#475569", fontWeight: 600 };
const errorStyle = { marginTop: "5px", color: "#b91c1c", fontSize: "13px" };
