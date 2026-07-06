import { useEffect, useState } from "react";
import { changePasswordApi } from "../api/authApi";

const DEFAULT_SETTINGS = {
    emailNotification: true,
    smsNotification: true,
    paymentReminder: true,
    monthlyStatement: false,
    language: "mn",
    theme: "light",
    };

const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.style.background = theme === "dark" ? "#0f172a" : "#f8fafc";
    document.body.style.color = theme === "dark" ? "#e5e7eb" : "#0f172a";
};

function loadSavedSettings() {
    try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem("customer_settings") || "{}") };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

    export default function Settings({ onLogout }) {
    const [settings, setSettings] = useState(loadSavedSettings);
    const [settingsMessage, setSettingsMessage] = useState("");
    const [settingsError, setSettingsError] = useState("");

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);

    const [passwordForm, setPasswordForm] = useState({
        currentPass: "",
        newPass: "",
        confirmPass: "",
    });

    useEffect(() => {
        applyTheme(settings.theme);
    }, [settings.theme]);

    const handleToggle = (name) => {
        setSettings((prev) => ({
        ...prev,
        [name]: !prev[name],
        }));

        setSettingsMessage("");
        setSettingsError("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setSettings((prev) => {
        const updated = {
            ...prev,
            [name]: value,
        };

        return updated;
        });

        setSettingsMessage("");
        setSettingsError("");
    };

    const handlePasswordInput = (e) => {
        const { name, value } = e.target;

        setPasswordForm((prev) => ({
        ...prev,
        [name]: value,
        }));

        setPasswordMessage("");
        setPasswordError("");
    };

    const handleSave = () => {
        try {
        localStorage.setItem("customer_settings", JSON.stringify(settings));
        applyTheme(settings.theme);
        setSettingsMessage("Тохиргоо амжилттай хадгалагдлаа.");
        setSettingsError("");
        } catch {
        setSettingsError("Тохиргоо хадгалахад алдаа гарлаа.");
        setSettingsMessage("");
        }
    };

    const handleChangePassword = async () => {
        if (
        !passwordForm.currentPass ||
        !passwordForm.newPass ||
        !passwordForm.confirmPass
        ) {
        setPasswordError("Нууц үгийн талбаруудыг бүрэн бөглөнө үү.");
        return;
        }

        if (passwordForm.newPass.length < 8) {
        setPasswordError("Шинэ нууц үг хамгийн багадаа 8 тэмдэгттэй байх ёстой.");
        return;
        }

        if (passwordForm.newPass !== passwordForm.confirmPass) {
        setPasswordError("Шинэ нууц үг таарахгүй байна.");
        return;
        }

        if (passwordForm.currentPass === passwordForm.newPass) {
        setPasswordError("Шинэ нууц үг хуучин нууц үгээс өөр байх ёстой.");
        return;
        }

        try {
        setPasswordLoading(true);
        setPasswordError("");
        setPasswordMessage("");

        await changePasswordApi(passwordForm);

        setPasswordForm({
            currentPass: "",
            newPass: "",
            confirmPass: "",
        });

        setPasswordMessage("Нууц үг амжилттай солигдлоо. Та дахин нэвтэрнэ үү.");

        //shaardlgtai bish bjblno
        setTimeout(async () => {
            if (onLogout) {
            await onLogout();
            } else {
            window.location.href = "/login";
            }
        }, 1200);

        } catch (error) {
        setPasswordError(
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Нууц үг солих үед алдаа гарлаа."
        );
        } finally {
        setPasswordLoading(false);
        }
    };

    return (
        <div style={styles.container} className="page-container">
        <div style={styles.sectionCard} className="section-card">
            <div style={styles.sectionHeader}>
            <div>
                <h3 style={styles.sectionTitle}>Ерөнхий тохиргоо</h3>
                <p style={styles.sectionSubText}>
                Хэл болон харагдах байдлын тохиргоо
                </p>
            </div>
            </div>

            <div style={styles.formGrid} className="form-grid">
            <div style={styles.inputGroup}>
                <label style={styles.label}>Хэл</label>
                <select
                name="language"
                value={settings.language}
                onChange={handleChange}
                style={styles.select}
                >
                <option value="mn">Монгол</option>
                <option value="en">English</option>
                </select>
            </div>

            <div style={styles.inputGroup}>
                <label style={styles.label}>Горим</label>
                <select
                name="theme"
                value={settings.theme}
                onChange={handleChange}
                style={styles.select}
                >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                </select>
            </div>
            </div>

            <div style={styles.divider} />

            <h3 style={styles.innerTitle}>Мэдэгдлийн тохиргоо</h3>

            <SettingToggle
            title="Имэйл мэдэгдэл"
            description="Зээлийн мэдээлэл болон төлөлтийн сануулгыг имэйлээр авах"
            checked={settings.emailNotification}
            onChange={() => handleToggle("emailNotification")}
            />

            <SettingToggle
            title="Төлбөрийн сануулга"
            description="Төлөх хугацаа дөхөх үед сануулга авах"
            checked={settings.paymentReminder}
            onChange={() => handleToggle("paymentReminder")}
            />

            <SettingToggle
            title="Сарын хуулга"
            description="Сар бүр төлөлтийн тайлан авах"
            checked={settings.monthlyStatement}
            onChange={() => handleToggle("monthlyStatement")}
            />

            <div style={styles.actions}>
            <button type="button" style={styles.saveButton} onClick={handleSave}>
                Тохиргоо хадгалах
            </button>
            </div>

            {settingsMessage && (
            <div style={styles.successBox}>{settingsMessage}</div>
            )}
            {settingsError && <div style={styles.errorBox}>{settingsError}</div>}
        </div>

        <div style={styles.sectionCard} className="section-card">
            <div style={styles.sectionHeader}>
            <div>
                <h3 style={styles.sectionTitle}>Аюулгүй байдал</h3>

                <button
                type="button"
                onClick={() => {
                    setShowPasswordForm((prev) => !prev);
                    setPasswordMessage("");
                    setPasswordError("");
                }}
                style={styles.changePasswordTextButton}
                >
                {showPasswordForm ? "Хаах" : "Нууц үг солих"}
                </button>
            </div>
            </div>

            {showPasswordForm && (
            <div>
                <div style={styles.formGrid} className="form-grid">
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Одоогийн нууц үг</label>
                    <input
                    type="password"
                    name="currentPass"
                    value={passwordForm.currentPass}
                    onChange={handlePasswordInput}
                    style={styles.input}
                    placeholder="Одоогийн нууц үг"
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Шинэ нууц үг</label>
                    <input
                    type="password"
                    name="newPass"
                    value={passwordForm.newPass}
                    onChange={handlePasswordInput}
                    style={styles.input}
                    placeholder="Шинэ нууц үг"
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Шинэ нууц үг давтах</label>
                    <input
                    type="password"
                    name="confirmPass"
                    value={passwordForm.confirmPass}
                    onChange={handlePasswordInput}
                    style={styles.input}
                    placeholder="Шинэ нууц үг давтах"
                    />
                </div>
                </div>

                <div style={styles.passwordActions}>
                <button
                    type="button"
                    onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordForm({
                        currentPass: "",
                        newPass: "",
                        confirmPass: "",
                    });
                    setPasswordMessage("");
                    setPasswordError("");
                    }}
                    style={styles.cancelButton}
                >
                    Болих
                </button>

                <button
                    type="button"
                    onClick={handleChangePassword}
                    style={{
                    ...styles.passwordButton,
                    opacity: passwordLoading ? 0.7 : 1,
                    cursor: passwordLoading ? "not-allowed" : "pointer",
                    }}
                    disabled={passwordLoading}
                >
                    {passwordLoading ? "Сольж байна..." : "Хадгалах"}
                </button>
                </div>

                {passwordMessage && (
                <div style={styles.successBox}>{passwordMessage}</div>
                )}
                {passwordError && <div style={styles.errorBox}>{passwordError}</div>}
            </div>
            )}
        </div>
        </div>
    );
    }

    function SettingToggle({ title, description, checked, onChange }) {
    return (
        <div style={styles.settingRow} className="setting-row">
        <div>
            <p style={styles.settingTitle}>{title}</p>
            <p style={styles.settingDescription}>{description}</p>
        </div>

        <button
            type="button"
            onClick={onChange}
            style={{
            ...styles.toggle,
            ...(checked ? styles.toggleActive : {}),
            }}
        >
            <span
            style={{
                ...styles.toggleCircle,
                ...(checked ? styles.toggleCircleActive : {}),
            }}
            />
        </button>
        </div>
    );
    }

    const styles = {
    container: {
        padding: "0 16px 24px 16px",
        maxWidth: "1200px",
        margin: "0 auto",
    },

    sectionCard: {
        background: "white",
        padding: "24px",
        borderRadius: "16px",
        border: "1px solid #f1f5f9",
        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
        marginBottom: "24px",
    },

    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "18px",
    },

    sectionTitle: {
        margin: "0 0 6px 0",
        fontSize: "18px",
        color: "#0f172a",
        fontWeight: "550",
    },

    sectionSubText: {
        margin: 0,
        color: "#64748b",
        fontSize: "14px",
    },

    innerTitle: {
        margin: "0 0 10px 0",
        fontSize: "16px",
        color: "#0f172a",
        fontWeight: "500",
    },

    divider: {
        height: "1px",
        background: "#f1f5f9",
        margin: "22px 0",
    },

    formGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
    },

    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },

    label: {
        color: "#475569",
        fontSize: "14px",
        fontWeight: "600",
    },

    select: {
        height: "42px",
        borderRadius: "10px",
        border: "1px solid #cbd5e1",
        padding: "0 12px",
        fontSize: "14px",
        outline: "none",
        color: "#0f172a",
        background: "white",
    },

    input: {
        height: "42px",
        borderRadius: "10px",
        border: "1px solid #cbd5e1",
        padding: "0 12px",
        fontSize: "14px",
        outline: "none",
        color: "#0f172a",
        background: "white",
    },

    settingRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "18px",
        padding: "16px 0",
        borderBottom: "1px solid #f1f5f9",
    },

    settingTitle: {
        margin: "0 0 5px 0",
        color: "#0f172a",
        fontSize: "15px",
        fontWeight: "550",
    },

    settingDescription: {
        margin: 0,
        color: "#64748b",
        fontSize: "14px",
    },

    toggle: {
        width: "48px",
        height: "26px",
        borderRadius: "999px",
        border: "none",
        background: "#cbd5e1",
        cursor: "pointer",
        padding: "3px",
        display: "flex",
        alignItems: "center",
        transition: "0.2s",
        flexShrink: 0,
    },

    toggleActive: {
        background: "#2563eb",
    },

    toggleCircle: {
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        background: "white",
        display: "block",
        transition: "0.2s",
        transform: "translateX(0)",
    },

    toggleCircleActive: {
        transform: "translateX(22px)",
    },

    actions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        marginTop: "22px",
    },

    passwordActions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        marginTop: "22px",
    },

    saveButton: {
        padding: "10px 18px",
        borderRadius: "10px",
        border: "none",
        background: "#2563eb",
        color: "white",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "700",
    },

    passwordButton: {
        padding: "10px 18px",
        borderRadius: "10px",
        border: "none",
        background: "#16a34a",
        color: "white",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "700",
    },

    cancelButton: {
        padding: "10px 18px",
        borderRadius: "10px",
        border: "1px solid #cbd5e1",
        background: "white",
        color: "#334155",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "700",
    },

    changePasswordTextButton: {
        marginTop: "8px",
        background: "transparent",
        border: "none",
        color: "#2563eb",
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: "700",
        padding: 0,
    },

    successBox: {
        background: "#dcfce7",
        color: "#15803d",
        borderRadius: "12px",
        padding: "12px 16px",
        marginTop: "14px",
        fontSize: "14px",
        fontWeight: "600",
    },

    errorBox: {
        background: "#fee2e2",
        color: "#b91c1c",
        borderRadius: "12px",
        padding: "12px 16px",
        marginTop: "14px",
        fontSize: "14px",
        fontWeight: "600",
    },
};
