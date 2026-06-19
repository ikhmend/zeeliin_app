import { useEffect, useState } from "react";

const DEFAULT_SETTINGS = {
    emailNotification: true,
    smsNotification: true,
    paymentReminder: true,
    monthlyStatement: false,
    language: "mn",
    theme: "light",
};

export default function Settings() {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const savedSettings = localStorage.getItem("customer_settings");

        if (savedSettings) {
            try {
                const parsedSettings = {
                    ...DEFAULT_SETTINGS,
                    ...JSON.parse(savedSettings),
                };

                setSettings(parsedSettings);
                applyTheme(parsedSettings.theme);
            } catch (error) {
                console.error("Settings parse error:", error);
                setSettings(DEFAULT_SETTINGS);
                applyTheme(DEFAULT_SETTINGS.theme);
            }
        } else {
            applyTheme(DEFAULT_SETTINGS.theme);
        }
    }, []);

    const applyTheme = (theme) => {
        if (theme === "dark") {
            document.body.style.background = "#0f172a";
            document.body.style.color = "#e5e7eb";
        } else {
            document.body.style.background = "#f8fafc";
            document.body.style.color = "#0f172a";
        }
    };

    const handleToggle = (name) => {
        setSettings((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));

        setSuccess("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setSettings((prev) => {
            const updated = {
                ...prev,
                [name]: value,
            };

            if (name === "theme") {
                applyTheme(value);
            }

            return updated;
        });

        setSuccess("");
    };

    const handleSave = () => {
        localStorage.setItem("customer_settings", JSON.stringify(settings));
        applyTheme(settings.theme);
        setSuccess("Тохиргоо амжилттай хадгалагдлаа.");
    };

    const handleReset = () => {
        const ok = window.confirm("Тохиргоог анхны төлөвт оруулах уу?");

        if (!ok) return;

        setSettings(DEFAULT_SETTINGS);
        localStorage.setItem("customer_settings", JSON.stringify(DEFAULT_SETTINGS));
        applyTheme(DEFAULT_SETTINGS.theme);
        setSuccess("Тохиргоо анхны төлөвт орлоо.");
    };

    return (
        <div style={styles.container}>
            {success && <div style={styles.successBox}>{success}</div>}

            <div style={styles.sectionCard}>
                <div style={styles.sectionHeader}>
                    <div>
                        <h3 style={styles.sectionTitle}>Ерөнхий тохиргоо</h3>
                        <p style={styles.sectionSubText}>
                            Хэл болон харагдах байдлын тохиргоо
                        </p>
                    </div>
                </div>

                <div style={styles.formGrid}>
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
                    title="SMS мэдэгдэл"
                    description="Төлөлтийн сануулга болон чухал мэдээллийг SMS-ээр авах"
                    checked={settings.smsNotification}
                    onChange={() => handleToggle("smsNotification")}
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
            </div>

            <div style={styles.sectionCard}>
                <div style={styles.sectionHeader}>
                    <div>
                        <h3 style={styles.sectionTitle}>Аюулгүй байдал</h3>
                        <p style={styles.sectionSubText}>
                            Нэвтрэх эрх болон хамгаалалтын мэдээлэл
                        </p>
                    </div>
                </div>

                <div style={styles.securityBox}>
                    <div>
                        <p style={styles.securityTitle}>Нууц үг солих</p>
                        <p style={styles.securityText}>
                        </p>
                    </div>

                    <button style={styles.disabledButton} disabled>
                        Нууц үг солих
                    </button>
                </div>
            </div>

            <div style={styles.actions}>

                <button style={styles.saveButton} onClick={handleSave}>
                    Хадгалах
                </button>
            </div>
        </div>
    );
}

function SettingToggle({ title, description, checked, onChange }) {
    return (
        <div style={styles.settingRow}>
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

    securityBox: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "18px",
        padding: "16px",
        borderRadius: "12px",
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
    },

    securityTitle: {
        margin: "0 0 5px 0",
        color: "#0f172a",
        fontSize: "15px",
        fontWeight: "550",
    },

    securityText: {
        margin: 0,
        color: "#64748b",
        fontSize: "14px",
    },

    disabledButton: {
        padding: "10px 16px",
        borderRadius: "10px",
        border: "none",
        background: "#e2e8f0",
        color: "#64748b",
        cursor: "not-allowed",
        fontSize: "14px",
        fontWeight: "550",
        whiteSpace: "nowrap",
    },

    actions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        marginBottom: "24px",
    },

    resetButton: {
        padding: "10px 18px",
        borderRadius: "10px",
        border: "1px solid #cbd5e1",
        background: "white",
        color: "#334155",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "700",
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

    successBox: {
        background: "#dcfce7",
        color: "#15803d",
        borderRadius: "12px",
        padding: "12px 16px",
        marginBottom: "16px",
        fontSize: "14px",
        fontWeight: "600",
    },
};