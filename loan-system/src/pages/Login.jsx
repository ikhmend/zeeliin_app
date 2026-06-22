import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
                const { token, user } = responseData.data;

                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));

                onLogin();
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
                    <div style={styles.tag}>SMART FINANCING</div>
                </div>

                <h1 style={styles.title}>Your smart financial solution</h1>

                <p style={styles.desc}>
                    From personal loans to business needs
                </p>
            </div>
            <div style={styles.right} className="auth-right">
                <div style={styles.card} className="auth-card">
                    <div style={styles.logoRow}>
                        <span style={styles.logoIcon}>LC</span> Loan Corp
                    </div>

                    <h2 style={styles.formTitle}>Login</h2>
                    <div style={{ ...styles.inputWrapper, marginBottom: "20px" }}>
                        <FiUser style={styles.inputIcon} />
                        <input
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ ...styles.cleanInput, fontSize: styles.input.fontSize || "15px", padding: "16px 40px" }}
                        />
                    </div>
                    <div style={{ ...styles.inputWrapper, marginBottom: "20px" }}>
                        <FiLock style={styles.inputIcon} />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
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
                        {loading ? "Logging in..." : "Login"}
                    </button>

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