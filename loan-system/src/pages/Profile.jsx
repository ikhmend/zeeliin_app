import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "../api/ProfileApi";

function profileToForm(data) {
    const acc = data?.account || {};
    const prof = data?.profile || {};
    return {
        email: prof.email || acc.email || "",
        phone: String(prof.phone || acc.phone || ""),
        current_address: prof.current_address || "",
        official_address: prof.official_address || "",
        social: prof.social || "",
        activity_dir: prof.activity_dir || "",
        business_type: prof.business_type || "",
        education: prof.education || "",
        profession: prof.profession || "",
    };
}

export default function Profile() {
    const [profileData, setProfileData] = useState(null);

    const [form, setForm] = useState({
        email: "",
        phone: "",
        current_address: "",
        official_address: "",
        social: "",
        activity_dir: "",
        business_type: "",
        education: "",
        profession: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const account = profileData?.account || {};
    const profile = profileData?.profile || {};

    const getInitialLetter = () => {
        if (profile.last_name) return profile.last_name.trim().charAt(0).toUpperCase();
        if (profile.first_name) return profile.first_name.trim().charAt(0).toUpperCase();
        if (account.full_name) return account.full_name.trim().charAt(0).toUpperCase();
        return "U";
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("mn-MN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMyProfile();

            setProfileData(data);
            setForm(profileToForm(data));
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                "Профайл мэдээлэл авахад алдаа гарлаа"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let active = true;
        getMyProfile()
            .then((data) => {
                if (!active) return;
                setProfileData(data);
                setForm(profileToForm(data));
            })
            .catch((err) => {
                if (!active) return;
                setError(err.response?.data?.message || err.response?.data?.error || err.message || "Профайл мэдээлэл авахад алдаа гарлаа");
            })
            .finally(() => active && setLoading(false));
        return () => { active = false; };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCancel = () => {
        setForm(profileToForm(profileData));
        setEditMode(false);
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const payload = {
                email: form.email,
                phone: form.phone,
                current_address: form.current_address,
                official_address: form.official_address,
                social: form.social,
                activity_dir: form.activity_dir,
                business_type: form.business_type,
                education: form.education,
                profession: form.profession,
            };

            await updateMyProfile(payload);

            setSuccess("Профайл амжилттай шинэчлэгдлээ.");
            setEditMode(false);

            await loadProfile();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                "Профайл шинэчлэхэд алдаа гарлаа"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <p style={styles.message}>Уншиж байна...</p>;
    }

    if (error && !profileData) {
        return <p style={styles.message}>{error}</p>;
    }

    if (!profileData) {
        return <p style={styles.message}>Профайл мэдээлэл олдсонгүй.</p>;
    }

    return (
        <div style={styles.container} className="page-container">
            {error && <div style={styles.errorBox}>{error}</div>}
            {success && <div style={styles.successBox}>{success}</div>}
            <div style={styles.headerBlock} className="responsive-card profile-header">
                <div style={styles.userInfoWrapper} className="responsive-card-header">
                    <div style={styles.avatarCircle}>
                        {getInitialLetter()}
                    </div>
                    <div style={styles.userTextInfo}>
                        <h2 style={styles.userNameText}>
                            {profile.last_name || profile.first_name ? (
                                `${profile.last_name || ""} ${profile.first_name || ""}`.trim()
                            ) : (
                                account.full_name || "Хэрэглэгч"
                            )}
                        </h2>
                        <span style={styles.userEmailText}>
                            {account.email || profile.email || "-"}
                        </span>
                        
                        {!editMode && (
                            <div style={styles.btnWrapper}>
                                <button
                                    style={styles.editButton}
                                    onClick={() => {
                                        setEditMode(true);
                                        setError("");
                                        setSuccess("");
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = "#eff6ff";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = "white";
                                    }}
                                >
                                    Шинэчлэх
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {!editMode ? (
                <>
                    {/* ДАНСНЫ МЭДЭЭЛЭЛ КАРТ */}
                    <div style={styles.sectionCard} className="responsive-card">
                        <h3 style={styles.sectionTitle}>Дансны мэдээлэл</h3>

                        <div style={styles.infoGrid} className="responsive-grid two-col-grid">
                            <InfoRow
                                label="Хэрэглэгчийн нэр"
                                value={account.username || "-"}
                            />

                            <InfoRow
                                label="Нэр"
                                value={account.full_name || "-"}
                            />

                            <InfoRow
                                label="Имэйл"
                                value={account.email || "-"}
                            />

                            <InfoRow
                                label="Утас"
                                value={account.phone || "-"}
                            />

                            <InfoRow
                                label="Эрх"
                                value={account.role || "-"}
                            />

                            <InfoRow
                                label="Төлөв"
                                value={account.is_active ? "Идэвхтэй" : "Идэвхгүй"}
                            />
                        </div>
                    </div>
                    <div style={styles.sectionCard} className="responsive-card">
                        <h3 style={styles.sectionTitle}>Хувийн мэдээлэл</h3>

                        <div style={styles.infoGrid} className="responsive-grid two-col-grid">
                            <InfoRow
                                label="Харилцагчийн код"
                                value={profile.customer_code || "-"}
                            />

                            <InfoRow
                                label="Регистр"
                                value={profile.register_no || "-"}
                            />

                            <InfoRow
                                label="Харилцагчийн төрөл"
                                value={profile.customer_type || "-"}
                            />

                            <InfoRow
                                label="Ургийн овог"
                                value={profile.family_name || "-"}
                            />

                            <InfoRow
                                label="Овог"
                                value={profile.last_name || "-"}
                            />

                            <InfoRow
                                label="Нэр"
                                value={profile.first_name || "-"}
                            />

                            <InfoRow
                                label="Төрсөн огноо"
                                value={formatDate(profile.birth_date)}
                            />

                            <InfoRow
                                label="Төрсөн газар"
                                value={profile.birth_place || "-"}
                            />
                        </div>
                    </div>
                    <div style={styles.sectionCard} className="responsive-card">
                        <h3 style={styles.sectionTitle}>
                            Холбоо барих, ажил мэргэжил
                        </h3>

                        <div style={styles.infoGrid} className="responsive-grid two-col-grid">
                            <InfoRow
                                label="Утас"
                                value={profile.phone || "-"}
                            />

                            <InfoRow
                                label="Гэрийн утас"
                                value={profile.home_phone || "-"}
                            />

                            <InfoRow
                                label="Имэйл/нэмэлт/"
                                value={profile.email || "-"}
                            />

                            <InfoRow
                                label="Сошиал"
                                value={profile.social || "-"}
                            />

                            <InfoRow
                                label="Бүртгэлтэй хаяг"
                                value={profile.official_address || "-"}
                            />

                            <InfoRow
                                label="Оршин суугаа хаяг"
                                value={profile.current_address || "-"}
                            />

                            <InfoRow
                                label="Үйл ажиллагааны чиглэл"
                                value={profile.activity_dir || "-"}
                            />

                            <InfoRow
                                label="Бизнесийн төрөл"
                                value={profile.business_type || "-"}
                            />

                            <InfoRow
                                label="Боловсрол"
                                value={profile.education || "-"}
                            />

                            <InfoRow
                                label="Мэргэжил"
                                value={profile.profession || "-"}
                            />
                        </div>
                    </div>
                </>
            ) : (
                <div style={styles.sectionCard} className="responsive-card">
                    <h3 style={styles.sectionTitle}>Мэдээлэл шинэчлэх</h3>

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputGrid} className="responsive-grid two-col-grid">
                            <FormInput
                                label="Имэйл"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Имэйл"
                            />

                            <FormInput
                                label="Утас"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Утас"
                            />

                            <FormInput
                                label="Сошиал"
                                name="social"
                                value={form.social}
                                onChange={handleChange}
                                placeholder="facebook, instagram гэх мэт"
                            />

                            <FormInput
                                label="Үйл ажиллагааны чиглэл"
                                name="activity_dir"
                                value={form.activity_dir}
                                onChange={handleChange}
                                placeholder="Жишээ: Худалдаа"
                            />

                            <FormInput
                                label="Бизнесийн төрөл"
                                name="business_type"
                                value={form.business_type}
                                onChange={handleChange}
                                placeholder="Жишээ: Дэлгүүр"
                            />

                            <FormInput
                                label="Боловсрол"
                                name="education"
                                value={form.education}
                                onChange={handleChange}
                                placeholder="Жишээ: Бакалавр"
                            />

                            <FormInput
                                label="Мэргэжил"
                                name="profession"
                                value={form.profession}
                                onChange={handleChange}
                                placeholder="Жишээ: Нягтлан"
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Албан хаяг</label>

                            <textarea
                                name="official_address"
                                value={form.official_address}
                                onChange={handleChange}
                                placeholder="Албан хаяг"
                                style={styles.textarea}
                                rows={3}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Одоогийн хаяг</label>

                            <textarea
                                name="current_address"
                                value={form.current_address}
                                onChange={handleChange}
                                placeholder="Одоогийн хаяг"
                                style={styles.textarea}
                                rows={3}
                            />
                        </div>

                        <div style={styles.actions} className="responsive-actions">
                            <button
                                type="button"
                                style={styles.cancelButton}
                                onClick={handleCancel}
                                disabled={saving}
                            >
                                Болих
                            </button>

                            <button
                                type="submit"
                                style={styles.saveButton}
                                disabled={saving}
                            >
                                {saving ? "Хадгалж байна..." : "Хадгалах"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div style={styles.infoRow} className="responsive-row">
            <span style={styles.infoLabel}>{label}</span>
            <strong style={styles.infoValue}>{value}</strong>
        </div>
    );
}

function FormInput({ label, name, value, onChange, placeholder }) {
    return (
        <div style={styles.inputGroup}>
            <label style={styles.label}>{label}</label>

            <input
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={styles.input}
            />
        </div>
    );
}

const styles = {
    container: {
        padding: "24px 16px 24px 16px",
        maxWidth: "1200px",
        margin: "0 auto",
    },

    headerBlock: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        marginBottom: "28px",
    },

    userInfoWrapper: {
        display: "flex",
        alignItems: "flex-start",
        gap: "20px",
    },

    avatarCircle: {
        width: "64px",
        height: "64px",
        borderRadius: "50%",
        background: "#e0f2fe", 
        color: "#2563eb", 
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "26px",
        fontWeight: "800",
        marginTop: "2px",
    },

    userTextInfo: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },

    userNameText: {
        margin: 0,
        fontSize: "22px",
        fontWeight: "700",
        color: "#0f172a",
        lineHeight: "1.2",
    },

    userEmailText: {
        fontSize: "14px",
        color: "#64748b",
        marginBottom: "6px",
    },

    btnWrapper: {
        display: "flex",
        justifyContent: "flex-start",
        marginTop: "4px",
    },

    editButton: {
        padding: "8px 16px",
        borderRadius: "8px",
        border: "1px solid #2563eb", 
        background: "white", 
        color: "#2563eb", 
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "700",
        whiteSpace: "nowrap",
        transition: "background 0.2s ease",
    },

    sectionCard: {
        background: "white",
        padding: "24px",
        borderRadius: "16px",
        border: "1px solid #f1f5f9",
        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
        marginBottom: "24px",
    },

    sectionTitle: {
        margin: "0 0 18px 0",
        fontSize: "18px",
        color: "#0f172a",
        fontWeight: "500",
    },

    infoGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0 32px",
    },

    infoRow: {
        display: "flex",
        justifyContent: "space-between",
        gap: "16px",
        padding: "13px 0",
        borderBottom: "1px solid #f1f5f9",
    },

    infoLabel: {
        color: "#64748b",
        fontSize: "14px",
        flexShrink: 0,
    },

    infoValue: {
        color: "#0f172a",
        fontSize: "14px",
        textAlign: "right",
        fontWeight: "500",
    },

    form: {
        marginTop: "4px",
    },

    inputGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "18px 20px",
        marginBottom: "18px",
    },

    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        marginBottom: "18px",
    },

    label: {
        color: "#475569",
        fontSize: "14px",
        fontWeight: "600",
    },

    input: {
        height: "42px",
        borderRadius: "10px",
        border: "1px solid #cbd5e1",
        padding: "0 12px",
        fontSize: "14px",
        outline: "none",
        color: "#0f172a",
    },

    textarea: {
        borderRadius: "10px",
        border: "1px solid #cbd5e1",
        padding: "12px",
        fontSize: "14px",
        outline: "none",
        color: "#0f172a",
        resize: "vertical",
        fontFamily: "inherit",
    },

    actions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        marginTop: "22px",
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

    errorBox: {
        background: "#fee2e2",
        color: "#b91c1c",
        borderRadius: "12px",
        padding: "12px 16px",
        marginBottom: "16px",
        fontSize: "14px",
        fontWeight: "600",
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

    message: {
        textAlign: "center",
        padding: "40px",
        color: "#64748b",
    },
};
