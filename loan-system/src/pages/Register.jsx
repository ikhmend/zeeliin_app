import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/loginStyles"; 
import { registerUser } from "../services/authService";

export default function Register() {
    // Бэкэндийн шаардаж буй бүх талбарын State-үүд
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [registerNo, setRegisterNo] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [pass, setPass] = useState("");
    const [repass, setRepass] = useState("");
    
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async () => {
        setError("");

        // Бүх талбарыг шалгах
        if (!lastName || !firstName || !registerNo || !birthDate || !phone || !email || !username || !pass || !repass) {
            setError("Талбарыг бүрэн бөглөнө үү");
            return;
        }

        if (pass !== repass) {
            setError("Нууц үг таарахгүй байна");
            return;
        }

        if (pass.length < 8) {
            setError("Нууц үг 8-аас дээш тэмдэгттэй байх ёстой.");
            return;
        }

        try {
            setLoading(true);

            // Бэкэнд рүү хэрэглэгчийн оруулсан бодит мэдээллийг дамжуулна
            const registerData = {
                last_name: lastName.trim(),
                first_name: firstName.trim(),
                register_no: registerNo.trim().toUpperCase(), // Регистрийг ТОМ үсгээр явуулна
                birth_date: birthDate,
                phone: phone.trim(),
                email: email.trim().toLowerCase(),
                username: username.trim().toLowerCase(),
                pass: pass,
                repass: repass
            };

            await registerUser(registerData);

            alert("Амжилттай бүртгэгдлээ. Та нэвтрэн орно уу.");
            navigate("/login");
        } catch (err) {
            // Бэкэндээс ирэх AppError-ийн алдааны мессежийг шууд харуулна
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Бүртгүүлэхэд алдаа гарлаа"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.left}>
                <div style={styles.tagRow}>
                    <div style={styles.tagIcon}>LC</div>
                    <div style={styles.tag}>SMART FINANCING</div>
                </div>
                <h1 style={styles.title}>Your smart financial solution</h1>
                <p style={styles.desc}>From personal loans to business needs</p>
            </div>

            {/* Олон талбартай болсон тул स्क्रोल хийж бодохоор style нэмэв */}
            <div style={{ ...styles.right, overflowY: "auto", padding: "40px 20px" }}>
                <div style={styles.card}>
                    <div style={styles.logoRow}>
                        <span style={styles.logoIcon}>LC</span> Loan Corp
                    </div>

                    <h2 style={styles.formTitle}>Sign Up</h2>

                    <input placeholder="Овог (Last Name)" value={lastName} onChange={(e) => setLastName(e.target.value)} style={styles.input} />
                    <input placeholder="Нэр (First Name)" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={styles.input} />
                    <input placeholder="Регистрийн дугаар (жишээ нь: АА12345678)" value={registerNo} onChange={(e) => setRegisterNo(e.target.value)} style={styles.input} />
                    
                    <div style={{ display: "flex", flexDirection: "column", alignSelf: "stretch", marginBottom: "12px" }}>
                        <label style={{ fontSize: "14px", color: "#475569", marginBottom: "4px", textAlign: "left", paddingLeft: "4px" }}>Төрсөн огноо</label>
                        <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} style={styles.input} />
                    </div>
                    
                    <input placeholder="Утасны дугаар" value={phone} onChange={(e) => setPhone(e.target.value)} style={styles.input} />
                    <input type="email" placeholder="И-мэйл хаяг" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
                    <input placeholder="Нэвтрэх нэр (Username)" value={username} onChange={(e) => setUsername(e.target.value)} style={styles.input} />
                    <input type="password" placeholder="Нууц үг" value={pass} onChange={(e) => setPass(e.target.value)} style={styles.input} />
                    <input type="password" placeholder="Нууц үг давтах" value={repass} onChange={(e) => setRepass(e.target.value)} style={styles.input} />

                    {error && (
                        <div style={{ color: "red", marginBottom: "12px", fontSize: "14px", textAlign: "left", width: "100%" }}>
                            {error}
                        </div>
                    )}

                    <button onClick={handleRegister} style={styles.button} disabled={loading}>
                        {loading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
                    </button>

                    <p style={styles.footer}>
                        Бүртгэлтэй юу?{" "}
                        <span style={styles.footerLink} onClick={() => navigate("/login")}>
                            Нэвтрэх
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}