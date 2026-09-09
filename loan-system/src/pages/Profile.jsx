import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "../api/ProfileApi";
import StateMessage from "../components/StateMessage";
import Toast from "../components/Toast";

function profileToForm(data) {
    const acc = data?.account || {};
    const prof = data?.profile || {};
    const employment = prof.employment || {};
    return {
        email: prof.email || acc.email || "",
        phone: String(prof.phone || acc.phone || ""),
        citizen_registration_no: prof.citizen_registration_no || "",
        current_address: prof.current_address || "",
        official_address: prof.official_address || "",
        living_address: prof.living_address || "",
        social: prof.social || "",
        activity_dir: prof.activity_dir || "",
        business_type: prof.business_type || "",
        education: prof.education || "",
        profession: prof.profession || "",
        organization_name: employment.organization_name || "",
        position: employment.position || "",
        worked_year: employment.worked_year ?? "",
        monthly_salary: employment.monthly_salary ?? "",
        organization_address: employment.organization_address || "",
        manager_name: employment.manager_name || "",
        manager_phone: employment.manager_phone || "",
    };
}

export default function Profile() {
    const [profileData, setProfileData] = useState(null);

    const [form, setForm] = useState({
        email: "",
        phone: "",
        citizen_registration_no: "",
        current_address: "",
        official_address: "",
        living_address: "",
        social: "",
        activity_dir: "",
        business_type: "",
        education: "",
        profession: "",
        organization_name: "",
        position: "",
        worked_year: "",
        monthly_salary: "",
        organization_address: "",
        manager_name: "",
        manager_phone: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState("");
    const [toast, setToast] = useState(null);

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
        setToast(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setToast(null);

            const payload = {
                email: form.email,
                phone: form.phone,
                citizen_registration_no: form.citizen_registration_no,
                current_address: form.current_address,
                official_address: form.official_address,
                living_address: form.living_address,
                social: form.social,
                activity_dir: form.activity_dir,
                business_type: form.business_type,
                education: form.education,
                profession: form.profession,
            };
            const employment = {
                organization_name: form.organization_name,
                position: form.position,
                worked_year: form.worked_year,
                monthly_salary: form.monthly_salary,
                organization_address: form.organization_address,
                manager_name: form.manager_name,
                manager_phone: form.manager_phone,
            };
            if (Object.values(employment).some(Boolean)) payload.employment = employment;

            await updateMyProfile(payload);

            setToast({ type: "success", message: "Профайл амжилттай шинэчлэгдлээ." });
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
        return <StateMessage type="loading" title="Уншиж байна" message="Профайл мэдээллийг ачаалж байна." />;
    }

    if (error && !profileData) {
        return <StateMessage type="error" title="Алдаа гарлаа" message={error} />;
    }

    if (!profileData) {
        return <StateMessage title="Профайл олдсонгүй" message="Таны профайл мэдээлэл одоогоор байхгүй байна." />;
    }

    return (
        <div style={styles.container} className="page-container">
            <Toast toast={toast} onClose={() => setToast(null)} />
            {error && <div style={styles.errorBox}>{error}</div>}
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
                                        setToast(null);
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = "#f3f4f6";
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
                        <h3 style={styles.sectionTitle}>Үндсэн мэдээлэл</h3>

                        <div style={styles.infoGrid} className="responsive-grid two-col-grid">
                            <InfoRow
                                label="Харилцагчийн код"
                                value={profile.customer_code || "-"}
                            />

                            <InfoRow
                                label="Регистрийн дугаар"
                                value={profile.register_no || "-"}
                            />

                            <InfoRow
                                label="Иргэний бүртгэлийн дугаар"
                                value={profile.citizen_registration_no || "-"}
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

                            <InfoRow
                                label="Боловсрол"
                                value={profile.education || "-"}
                            />

                            <InfoRow
                                label="Мэргэжил"
                                value={profile.profession || "-"}
                            />

                            <InfoRow
                                label="Үйл ажиллагааны чиглэл"
                                value={profile.activity_dir || "-"}
                            />

                            <InfoRow
                                label="Хөдөлмөр эрхлэлт"
                                value={profile.business_type || "-"}
                            />
                        </div>
                    </div>
                    <div style={styles.sectionCard} className="responsive-card">
                        <h3 style={styles.sectionTitle}>
                            Холбоо барих мэдээлэл
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
                                label="И-мэйл"
                                value={profile.email || "-"}
                            />

                            <InfoRow
                                label="Сошиал"
                                value={profile.social || "-"}
                            />

                            <InfoRow
                                label="Амьдарч байгаа хаяг"
                                value={profile.living_address || "-"}
                            />

                            <InfoRow
                                label="Албан ёсны хаяг"
                                value={profile.official_address || "-"}
                            />

                            <InfoRow
                                label="Оршин суугаа хаяг"
                                value={profile.current_address || "-"}
                            />

                        </div>
                    </div>
                    <div style={styles.sectionCard} className="responsive-card">
                        <h3 style={styles.sectionTitle}>Хөдөлмөр эрхлэлт</h3>

                        <div style={styles.infoGrid} className="responsive-grid two-col-grid">
                            <InfoRow label="Байгууллага" value={profile.employment?.organization_name || "-"} />
                            <InfoRow label="Албан тушаал" value={profile.employment?.position || "-"} />
                            <InfoRow label="Ажилласан жил" value={profile.employment?.worked_year ? `${profile.employment.worked_year} жил` : "-"} />
                            <InfoRow label="Сарын цалин" value={profile.employment?.monthly_salary ? new Intl.NumberFormat("mn-MN").format(profile.employment.monthly_salary) : "-"} />
                            <InfoRow label="Байгууллагын хаяг" value={profile.employment?.organization_address || "-"} />
                            <InfoRow label="Удирдах албан тушаалтан" value={profile.employment?.manager_name || "-"} />
                            <InfoRow label="Удирдах ажилтны утас" value={profile.employment?.manager_phone || "-"} />
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
                                label="Иргэний бүртгэлийн дугаар"
                                name="citizen_registration_no"
                                value={form.citizen_registration_no}
                                onChange={handleChange}
                                placeholder="Иргэний бүртгэлийн дугаар"
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

                            <FormInput label="Байгууллага" name="organization_name" value={form.organization_name} onChange={handleChange} placeholder="Байгууллагын нэр" />
                            <FormInput label="Албан тушаал" name="position" value={form.position} onChange={handleChange} placeholder="Албан тушаал" />
                            <FormInput label="Ажилласан жил" name="worked_year" type="number" value={form.worked_year} onChange={handleChange} placeholder="Жишээ: 5" />
                            <FormInput label="Сарын цалин" name="monthly_salary" type="number" value={form.monthly_salary} onChange={handleChange} placeholder="Жишээ: 2500000" />
                            <FormInput label="Удирдах албан тушаалтан" name="manager_name" value={form.manager_name} onChange={handleChange} placeholder="Нэр" />
                            <FormInput label="Удирдах ажилтны утас" name="manager_phone" value={form.manager_phone} onChange={handleChange} placeholder="8 оронтой утас" />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Амьдарч байгаа хаяг</label>

                            <textarea
                                name="living_address"
                                value={form.living_address}
                                onChange={handleChange}
                                placeholder="Амьдарч байгаа хаяг"
                                style={styles.textarea}
                                rows={3}
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
                            <label style={styles.label}>Байгууллагын хаяг</label>

                            <textarea
                                name="organization_address"
                                value={form.organization_address}
                                onChange={handleChange}
                                placeholder="Байгууллагын хаяг"
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

function FormInput({ label, name, value, onChange, placeholder, type = "text" }) {
    return (
        <div style={styles.inputGroup}>
            <label style={styles.label}>{label}</label>

            <input
                type={type}
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
        background: "#f3f4f6", 
        color: "#111827", 
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
        border: "1px solid #111827", 
        background: "white", 
        color: "#111827", 
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
        background: "#111827",
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

    message: {
        textAlign: "center",
        padding: "40px",
        color: "#64748b",
    },
};
