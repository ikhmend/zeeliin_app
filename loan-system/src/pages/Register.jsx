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
  pass: "",
  repass: "",
};

const fieldLabels = {
  last_name: "Овог",
  first_name: "Нэр",
  register_no: "Регистрийн дугаар",
  birth_date: "Төрсөн огноо",
  phone: "Утасны дугаар",
  email: "И-мэйл",
  pass: "Нууц үг",
  repass: "Нууц үг давтах",
};

const fields = [
  ["last_name", "Овог", "text", "Бат"],
  ["first_name", "Нэр", "text", "Дорж"],
  ["register_no", "Регистрийн дугаар", "text", "АА12345678"],
  ["birth_date", "Төрсөн огноо", "date", ""],
  ["phone", "Утасны дугаар", "tel", "99112233"],
  ["email", "И-мэйл", "email", "name@example.com"],
  ["pass", "Нууц үг", "password", "8-аас дээш тэмдэгт"],
  ["repass", "Нууц үг давтах", "password", ""],
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
  if (form.pass && form.pass.length < 8) errors.pass = "Нууц үг 8-аас дээш тэмдэгттэй байна.";
  if (form.pass && form.repass && form.pass !== form.repass) errors.repass = "Нууц үг таарахгүй байна.";
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
        pass: form.pass,
        repass: form.repass,
      });
      navigate("/login", { state: { registered: true } });
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
    <div style={styles.wrapper} className="auth-wrapper">
      <div style={styles.left} className="auth-left">
        <div style={styles.tagRow}>
          <div style={styles.tagIcon}>LC</div>
          <div style={styles.tag}>ХУВИЙН ЗЭЭЛИЙН СИСТЕМ</div>
        </div>
        <h1 style={styles.title}>Зээлийн мэдээллээ нэг дороос хянах</h1>
        <p style={styles.desc}>Бүртгүүлээд өөрийн хувийн зээл, төлөлтийн хуваарь, профайл мэдээллээ шалгана уу.</p>
      </div>

      <div style={{ ...styles.right, overflowY: "auto", padding: "32px 20px" }} className="auth-right">
        <form style={styles.card} className="auth-card" onSubmit={handleRegister} noValidate>
          <div style={styles.logoRow}>
            <span style={styles.logoIcon}>LC</span> Зээлийн систем
          </div>
          <h2 style={styles.formTitle}>Бүртгүүлэх</h2>
          {generalError && <div className="auth-error-message">{generalError}</div>}

          {fields.map(([name, label, type, placeholder]) => (
            <div key={name} style={fieldWrap}>
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

const fieldWrap = { width: "100%", marginBottom: "14px" };
const labelStyle = { display: "block", marginBottom: "6px", fontSize: "13px", color: "#475569", fontWeight: 600 };
const errorStyle = { marginTop: "5px", color: "#b91c1c", fontSize: "13px" };
