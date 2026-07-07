import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/loginStyles"; 
import { loginUser } from "../services/authService";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export default function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async () => {
        if (!username || !password) {
            setError("Username болон password оруулна уу");
            return;
        }

        try {
            setError("");
            setLoading(true);
            const responseData = await loginUser(username.trim().toLowerCase(), password);

            if (responseData && responseData.data) {
                const { user } = responseData.data;
                onLogin(user);
                navigate("/dashboard", { replace: true });
            } else {
                setError("Нэвтрэх мэдээлэл дутуу ирлээ.");
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Нэвтрэхэд алдаа гарлаа"
            );
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

                <p style={styles.desc}>
                    Өөрийн хувийн зээл, төлөлтийн хуваарь, профайл мэдээллээ шалгана уу.
                </p>
            </div>
            <div style={styles.right} className="auth-right">
                <div style={styles.card} className="auth-card">
                    <div style={styles.logoRow}>
                        <span style={styles.logoIcon}>LC</span> Зээлийн систем
                    </div>

                    <h2 style={styles.formTitle}>Нэвтрэх</h2>
                    {location.state?.registered && (
                        <div className="auth-success-message">
                            Бүртгэл үүслээ. {location.state.email || "И-мэйл"} хаягаар очсон холбоосоор нууц үгээ үүсгэнэ үү.
                        </div>
                    )}
                    {location.state?.passwordReset && (
                        <div className="auth-success-message">Нууц үг шинэчлэгдлээ. Шинэ нууц үгээрээ нэвтэрнэ үү.</div>
                    )}
                    <div style={{ ...styles.inputWrapper, marginBottom: "20px" }}>
                        <FiUser style={styles.inputIcon} />
                        <input
                            placeholder="Утас, и-мэйл эсвэл нэвтрэх нэр"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ ...styles.cleanInput, fontSize: styles.input.fontSize || "15px", padding: "16px 40px" }}
                        />
                    </div>
                    <div style={{ ...styles.inputWrapper, marginBottom: "20px" }}>
                        <FiLock style={styles.inputIcon} />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Нууц үг"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ ...styles.cleanInput, fontSize: styles.input.fontSize || "15px", padding: "16px 40px" }}
                        />
                        <div 
                            onClick={() => setShowPassword(!showPassword)} 
                            style={styles.eyeIcon}
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </div>
                    </div>

                    {error && (
                        <div style={{ color: "red", marginBottom: "12px", fontSize: "14px", textAlign: "left" }}>
                            {error}
                        </div>
                    )}
                    <button
                        onClick={handleLogin}
                        style={{ ...styles.button, ...styles.blueButton, margin: "12px 0 24px 0" }}
                        disabled={loading}
                    >
                        {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
                    </button>

                    <p style={styles.footer}>
                        <span style={styles.footerLink} onClick={() => navigate("/forgot-password")}>
                            Нууц үгээ мартсан уу?
                        </span>
                    </p>
                    <p style={styles.footer}>
                        Шинэ хэрэглэгч үү?{" "}
                        <span style={styles.footerLink} onClick={() => navigate("/register")}>
                            Бүртгүүлэх
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
