import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    getLoanDetail,
    getLoanInstallments,
    getLoanPayments,
} from "../api/LoansApi";
import { getMyProfile } from "../api/ProfileApi";
import { ArrowLeft, BriefcaseBusiness, CreditCard, Phone, RefreshCw, UserRound } from "lucide-react";
import StateMessage from "../components/StateMessage";
import Toast from "../components/Toast";
import Pagination from "../components/Pagination";

export default function LoanDetail() {
    const { loanId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [loan, setLoan] = useState(null);
    const [installments, setInstallments] = useState([]);
    const [payments, setPayments] = useState([]);
    const [profile, setProfile] = useState(null);
    const [activeTab, setActiveTab] = useState("customer");
    const [toast, setToast] = useState(() => location.state?.toast || null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const formatMoney = (amount, currency = "MNT") => {
        return (
            new Intl.NumberFormat("mn-MN", {
                maximumFractionDigits: 2,
            }).format(Number(amount) || 0) +
            " " +
            (currency || "MNT")
        );
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("mn-MN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    const formatPercent = (value) => {
        return `${Number(value || 0).toFixed(2)}%`;
    };

    const getLoanValue = (...keys) => {
        for (const key of keys) {
            const value = key
                .split(".")
                .reduce((obj, part) => obj?.[part], loan);

            if (value !== undefined && value !== null && value !== "") {
                return value;
            }
        }
        return null;
    };

    const getProductName = (product) => {
        if (product === "personal") return "Хувийн зээл";
        if (product === "business") return "Бизнес зээл";
        return product || "-";
    };

    const getStatusName = (status) => {
        if (status === "active") return "Идэвхтэй";
        if (status === "closed") return "Хаагдсан";
        if (status === "overdue") return "Хугацаа хэтэрсэн";
        if (status === "pending") return "Хүлээгдэж байна";
        return status || "-";
    };

    const getInstallmentStatusName = (status) => {
        if (status === "paid") return "Төлсөн";
        if (status === "pending") return "Төлөх";
        if (status === "partial") return "Хэсэгчлэн төлсөн";
        if (status === "overdue") return "Хугацаа хэтэрсэн";
        return status || "-";
    };

    const getInstallmentStatusStyle = (status) => {
        const base = {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "100px",
            padding: "6px 10px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: "700",
        };

        if (status === "paid") {
            return { ...base, background: "#dcfce7", color: "#15803d" };
        }
        if (status === "partial") {
            return { ...base, background: "#fef3c7", color: "#92400e" };
        }
        if (status === "overdue") {
            return { ...base, background: "#fee2e2", color: "#b91c1c" };
        }
        return { ...base, background: "#f3f4f6", color: "#374151" };
    };

    const getInstallmentRemainingAmount = (installment) => {
        return Number(
            installment.remaining_amount ??
            installment.remainingAmount ??
            installment.total_amount ??
            installment.totalAmount ??
            0
        );
    };

    const getFirstPayableInstallment = () => {
        return installments.find((item) => {
            const status =
                item.status ||
                item.installment_status ||
                item.installmentStatus;

            const remainingAmount = getInstallmentRemainingAmount(item);
            return status !== "paid" && remainingAmount > 0;
        });
    };

const paginatedInstallments = installments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
);

    useEffect(() => {
        async function loadLoanDetail() {
            try {
                setLoading(true);
                setError("");

                const [loanData, installmentData, profileData, paymentData] = await Promise.all([
                    getLoanDetail(loanId),
                    getLoanInstallments(loanId),
                    getMyProfile(),
                    getLoanPayments(loanId),
                ]);

                setLoan(loanData);
                setInstallments(installmentData || []);
                setProfile(profileData);
                setPayments(paymentData || []);
                setCurrentPage(1);
            } catch (err) {
                setError(err.response?.data?.error || "Зээлийн мэдээлэл авахад алдаа гарлаа");
            } finally {
                setLoading(false);
            }
        }
        loadLoanDetail();
    }, [loanId]);

    useEffect(() => {
        if (location.state?.toast) {
            navigate(location.pathname, { replace: true, state: null });
        }
    }, [location.pathname, location.state, navigate]);

    useEffect(() => {
        if (!loading && location.hash === "#payment-schedule") {
            document.getElementById("payment-schedule")?.scrollIntoView({ behavior: "smooth" });
        }
    }, [loading, location.hash]);

    if (loading) return <StateMessage type="loading" title="Уншиж байна" message="Зээлийн дэлгэрэнгүй мэдээллийг ачаалж байна." />;
    if (error) return <StateMessage type="error" title="Алдаа гарлаа" message={error} />;
    if (!loan) return <StateMessage title="Зээл олдсонгүй" message="Сонгосон зээлийн мэдээлэл байхгүй байна." />;

    const currency = getLoanValue("currency", "currency_code", "currencyCode") || "MNT";
    const loanProduct = getLoanValue("loan_product", "loanProduct", "loan_type", "product");
    const accountNumber = getLoanValue("account_no", "account_number", "accountNo");
    const startDate = getLoanValue("start_date", "startDate", "loan_start_date");
    const previousLoanBalance = getLoanValue("previous_loan_balance", "previousBalance");
    const interestRate = getLoanValue("interest_rate", "interestRate", "interest");
    const feePercent = getLoanValue("fee_percent", "feePercent", "fee_rate");
    const feeAmount = getLoanValue("fee_amount", "feeAmount", "commission_amount");
    const customer = profile?.profile || {};
    const totalLoanAmount = Number(loan.loan_amount || loan.amount || 0);
    const currentBalance = installments.reduce((sum, item) => sum + getInstallmentRemainingAmount(item), 0);
    const totalPaid = installments.reduce(
        (sum, item) => sum + Number(item.paid_amount ?? (item.total_amount || 0) - getInstallmentRemainingAmount(item)),
        0,
    );
    const closingAmount = installments.reduce(
        (sum, item) => sum + Number(item.remaining_amount ?? item.total_amount ?? 0),
        0,
    );

    return (
        <>
        <Toast toast={toast} onClose={() => setToast(null)} />
        <div style={styles.container}>
            <button style={styles.backButton} onClick={() => navigate("/loans")}>
                <ArrowLeft className="size-4" />
            </button>

            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>
                        Зээлийн дэлгэрэнгүй
                    </h1>
                    <p style={styles.subText}>
                        Код: <strong>{loan.loan_code || loan.loanCode || `Зээл #${loan.id}`}</strong>
                        <span style={styles.headerDivider}>|</span>
                        Данс: <strong style={styles.accountText}>{accountNumber || "-"}</strong>
                    </p>
                </div>
                <div style={styles.headerActions}>
                    <span style={styles.status}>{getStatusName(loan.loan_status || loan.status)}</span>
                    <button style={styles.refreshButton} onClick={() => window.location.reload()}>
                        <RefreshCw className="size-4" /> Шинэчлэх
                    </button>
                </div>
            </div>

            <div style={styles.cards}>
                <div style={styles.card}>
                    <p style={styles.cardLabel}>Олгогдсон дүн</p>
                    <h2 style={styles.cardValue}>{formatMoney(totalLoanAmount, currency)}</h2>
                </div>
                <div style={styles.card}>
                    <p style={styles.cardLabel}>Одоогийн үлдэгдэл</p>
                    <h2 style={styles.cardValue}>{formatMoney(currentBalance, currency)}</h2>
                </div>
                <div style={styles.card}>
                    <p style={styles.cardLabel}>Хаах дүн</p>
                    <h2 style={styles.cardValue}>{formatMoney(closingAmount, currency)}</h2>
                </div>
                <div style={styles.card}>
                    <p style={styles.cardLabel}>Нийт төлсөн</p>
                    <h2 style={styles.cardValue}>{formatMoney(totalPaid, currency)}</h2>
                </div>
            </div>

            <div style={styles.tabs}>
                <button style={activeTab === "customer" ? styles.activeTab : styles.tab} onClick={() => setActiveTab("customer")}>Хэрэглэгчийн мэдээлэл</button>
                <button style={activeTab === "loan" ? styles.activeTab : styles.tab} onClick={() => setActiveTab("loan")}>Зээл</button>
                <button style={activeTab === "schedule" ? styles.activeTab : styles.tab} onClick={() => setActiveTab("schedule")}>Төлөлтийн хуваарь</button>
                <button style={activeTab === "payments" ? styles.activeTab : styles.tab} onClick={() => setActiveTab("payments")}>Төлөлтийн түүх</button>
            </div>

            {activeTab === "customer" && <div style={styles.customerBox}>
                <div style={styles.customerHeader}>
                    <div style={styles.customerIdentity}>
                        <div style={styles.avatar}><UserRound className="size-6" /></div>
                        <div>
                            <h3 style={styles.customerName}>{`${customer.last_name || ""} ${customer.first_name || ""}`.trim() || "Хэрэглэгч"}</h3>
                            <p style={styles.customerSubtext}>Хэрэглэгчийн үндсэн мэдээлэл</p>
                        </div>
                    </div>
                    <button style={styles.detailButton} onClick={() => navigate("/profile")}>Дэлгэрэнгүй харах</button>
                </div>
                <div style={styles.customerFields}>
                    <InfoCard icon={<CreditCard />} label="Регистр" value={customer.register_no || "-"} />
                    <InfoCard icon={<Phone />} label="Утас" value={customer.phone || "-"} />
                    <InfoCard icon={<Phone />} label="Утас 2" value={customer.home_phone || "-"} />
                    <InfoCard icon={<BriefcaseBusiness />} label="Ажлын газар" value={customer.activity_dir || "-"} />
                </div>
            </div>}

            {activeTab === "loan" && <div id="loan-info" style={styles.loanInfo}>
                <h3 style={styles.boxTitle}>Зээлийн мэдээлэл</h3>
                <InfoRow label="Зээлийн төрөл" value={getProductName(loanProduct)} />
                <InfoRow label="Валют" value={currency || "-"} />
                <InfoRow label="Эхэлсэн огноо" value={formatDate(startDate)} />
                <InfoRow label="Хугацаа" value={`${loan.duration_month || 0} сар`} />
                <InfoRow label="Хүүгийн хувь" value={formatPercent(interestRate)} />
                <InfoRow label="Шимтгэлийн хувь" value={formatPercent(feePercent)} />
                <InfoRow label="Шимтгэлийн дүн" value={formatMoney(feeAmount, currency)} />
                <InfoRow label="Өмнөх зээлийн үлдэгдэл" value={formatMoney(previousLoanBalance, currency)} />
            </div>}

            {activeTab === "schedule" && <div id="payment-schedule" style={styles.section}>
                <div style={styles.scheduleHeader}>
                    <div>
                        <h3 style={styles.boxTitle}>Төлөлтийн хуваарь</h3>
                        <p style={styles.scheduleSubText}>Нийт {installments.length} төлөлт байна</p>
                    </div>
                </div>

                {installments.length === 0 ? (
                    <p style={styles.emptyText}>Төлөлтийн хуваарь байхгүй байна.</p>
                ) : (
                    <>
                        <div style={styles.tableResponsive}>
                            <div style={styles.table}>
                                <div style={styles.tableHeader5}>
                                    <span>Огноо</span>
                                    <span>Төлөх дүн</span>
                                    <span>Үлдэгдэл</span>
                                    <span>Төлөв</span>
                                    <span>Үйлдэл</span>
                                </div>

                                {paginatedInstallments.map((item, index) => {
                                    const dueDate = item.due_date || item.dueDate || item.payment_date;
                                    const totalAmount = item.total_amount ?? item.totalAmount ?? item.amount;
                                    const remainingAmount = item.remaining_amount ?? item.remainingAmount ?? item.balance_after_payment;
                                    const status = item.status || item.installment_status;

                                    const firstPayableInstallment = getFirstPayableInstallment();
                                    const isPaid = status === "paid";
                                    const isPartial = status === "partial";

                                    const canPay =
                                        !isPaid &&
                                        String(firstPayableInstallment?.id) === String(item.id);

                                    return (
                                        <div key={item.id || index} style={styles.tableRow5}>
                                            <span>{formatDate(dueDate)}</span>
                                            <span style={styles.moneyText}>{formatMoney(totalAmount, currency)}</span>
                                            <span style={styles.moneyText}>{formatMoney(remainingAmount, currency)}</span>
                                            <span>
                                                <span style={getInstallmentStatusStyle(status)}>
                                                    {getInstallmentStatusName(status)}
                                                </span>
                                            </span>
                                            <span>
                                                {isPaid ? (
                                                    <button style={styles.paidButton} disabled>Төлсөн</button>
                                                ) : canPay ? (
                                                    <button
                                                        style={styles.payButton}
                                                        onClick={() => navigate(`/loans/${loanId}/pay`)}
                                                    >
                                                        {isPartial ? "Үлдэгдэл" : "Төлөх"}
                                                    </button>
                                                ) : (
                                                    
                                                    <button 
                                                        style={styles.waitButton} 
                                                        disabled
                                                        title="Та эхлээд өмнөх төлөлтийг хийнэ үү."
                                                    >
                                                        Дараагийнх
                                                    </button>
                                                )}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <Pagination
                            totalItems={installments.length}
                            page={currentPage}
                            pageSize={pageSize}
                            onPageChange={setCurrentPage}
                            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
                        />
                    </>
                )}
            </div>}

            {activeTab === "payments" && <div style={styles.section}>
                <h3 style={styles.boxTitle}>Төлөлтийн түүх</h3>
                {payments.length === 0 ? (
                    <p style={styles.emptyText}>Төлөлтийн түүх байхгүй байна.</p>
                ) : (
                    <div style={styles.paymentList}>
                        {payments.map((payment) => (
                            <div key={payment.id} style={styles.paymentRow}>
                                <span>{formatDate(payment.payment_date)}</span>
                                <strong>{formatMoney(payment.payment_amount, currency)}</strong>
                            </div>
                        ))}
                    </div>
                )}
            </div>}
        </div>
        </>
    );
}

function InfoRow({ label, value }) {
    return (
        <div style={styles.infoRow}>
            <span style={styles.infoLabel}>{label}</span>
            <strong style={styles.infoValue}>{value}</strong>
        </div>
    );
}

function InfoCard({ icon, label, value }) {
    return (
        <div style={styles.infoCard}>
            <div style={styles.infoCardIcon}>{icon}</div>
            <span style={styles.infoLabel}>{label}</span>
            <strong style={styles.infoValue}>{value}</strong>
        </div>
    );
}

const styles = {
    container: {
        padding: "16px 16px 24px 16px",
        maxWidth: "1200px",
        margin: "0 auto",
        boxSizing: "border-box",
    },
    backButton: {
        marginBottom: "12px",
        background: "transparent",
        border: "none",
        color: "#0f172a",
        cursor: "pointer",
        padding: 0,
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "28px",
    },
    title: { margin: "0 0 6px 0", fontSize: "24px", color: "#0f172a" },
    subText: { margin: 0, color: "#64748b", fontSize: "14px" },
    headerDivider: { margin: "0 8px", color: "#94a3b8" },
    accountText: { color: "#111827" },
    headerActions: { display: "flex", alignItems: "center", gap: "10px" },
    status: {
        padding: "7px 14px",
        borderRadius: "999px",
        background: "#dcfce7",
        color: "#15803d",
        fontSize: "13px",
        fontWeight: "700",
        whiteSpace: "nowrap",
    },
    refreshButton: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 14px",
        border: "1px solid #cbd5e1",
        borderRadius: "10px",
        background: "white",
        color: "#0f172a",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
    },
    cards: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", // Гар утсанд автоматаар доошоо шилжинэ
        gap: "20px",
        marginBottom: "28px",
    },
    card: {
        background: "white",
        padding: "22px 20px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        boxShadow: "none",
    },
    cardLabel: { margin: "0 0 8px 0", color: "#64748b", fontSize: "14px" },
    cardValue: { margin: 0, color: "#0f172a", fontSize: "18px", fontWeight: "700" },
    tabs: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        width: "fit-content",
        marginBottom: "12px",
        padding: "4px",
        borderRadius: "12px",
        background: "#f1f5f9",
    },
    tab: {
        border: "none",
        background: "transparent",
        padding: "10px 14px",
        borderRadius: "9px",
        color: "#0f172a",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "600",
    },
    activeTab: {
        border: "none",
        background: "white",
        padding: "10px 14px",
        borderRadius: "9px",
        color: "#0f172a",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "700",
        boxShadow: "0 1px 3px rgba(15, 23, 42, 0.12)",
    },
    customerBox: {
        background: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        marginBottom: "24px",
        overflow: "hidden",
    },
    customerHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "24px",
        borderBottom: "1px solid #e2e8f0",
    },
    customerIdentity: { display: "flex", alignItems: "center", gap: "14px" },
    avatar: {
        display: "grid",
        placeItems: "center",
        width: "54px",
        height: "54px",
        borderRadius: "50%",
        background: "#f3f4f6",
        color: "#111827",
    },
    customerName: { margin: 0, fontSize: "18px", color: "#0f172a" },
    customerSubtext: { margin: "5px 0 0", color: "#64748b", fontSize: "13px" },
    detailButton: {
        padding: "10px 16px",
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        background: "white",
        color: "#0f172a",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "700",
    },
    customerFields: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "14px",
        padding: "24px",
    },
    infoCard: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "8px",
        minHeight: "82px",
        padding: "16px 18px",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        textAlign: "left",
    },
    infoCardIcon: { color: "#64748b", height: "20px" },
    loanInfo: {
        background: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "24px",
    },
    paymentList: { display: "grid", gap: "0" },
    paymentRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 0",
        borderBottom: "1px solid #e2e8f0",
        color: "#475569",
        fontSize: "14px",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", // Гар утсанд 1 багана болно
        gap: "24px",
        marginBottom: "24px",
    },
    box: {
        background: "white",
        padding: "24px",
        borderRadius: "16px",
        border: "1px solid #f1f5f9",
        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
    },
    section: {
        background: "white",
        padding: "24px",
        borderRadius: "16px",
        border: "1px solid #f1f5f9",
        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
        marginBottom: "24px",
    },
    boxTitle: { margin: "0 0 18px 0", fontSize: "18px", color: "#0f172a", fontWeight: "700" },
    infoRow: {
        display: "flex",
        justifyContent: "space-between",
        gap: "16px",
        padding: "12px 0",
        borderBottom: "1px solid #f1f5f9",
    },
    infoLabel: { color: "#64748b", fontSize: "14px" },
    infoValue: { color: "#0f172a", fontSize: "14px", textAlign: "right" },
    scheduleHeader: { marginBottom: "14px" },
    scheduleSubText: { margin: "4px 0 0 0", color: "#64748b", fontSize: "13px" },
    
    /* 🌟 ГАР УТАСНЫ ХАРАГДАЦЫГ ЗАССАН ГОЛ ХЭСЭГ */
    tableResponsive: {
        width: "100%",
        overflowX: "auto", // Дэлгэц багасах үед хүснэгтийг баруун, зүүн тийш гүйдэг болгоно
        WebkitOverflowScrolling: "touch",
        borderRadius: "14px",
        border: "1px solid #e2e8f0",
    },
    table: {
        minWidth: "650px", // Хүснэгтийн багануудын хамгийн бага өргөнийг хадгалж, давхцахаас сэргийлнэ
        background: "#ffffff",
    },
    tableHeader5: {
        display: "grid",
        gridTemplateColumns: "1.2fr 1.5fr 1.5fr 1.2fr 1.2fr",
        gap: "12px",
        background: "#f8fafc",
        padding: "16px 18px",
        fontSize: "13px",
        fontWeight: "700",
        color: "#475569",
        borderBottom: "1px solid #e2e8f0",
    },
    tableRow5: {
        display: "grid",
        gridTemplateColumns: "1.2fr 1.5fr 1.5fr 1.2fr 1.2fr",
        gap: "12px",
        alignItems: "center",
        padding: "16px 18px",
        borderTop: "1px solid #f1f5f9",
        fontSize: "14px",
        color: "#0f172a",
    },
    moneyText: { fontWeight: "600", whiteSpace: "nowrap" },
    pagination: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: "12px",
        marginTop: "18px",
    },
    pageButton: {
        width: "38px",
        height: "38px",
        borderRadius: "10px",
        border: "1px solid #cbd5e1",
        background: "#ffffff",
        color: "#334155",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "700",
    },
    disabledButton: { opacity: 0.45, cursor: "not-allowed" },
    pageInfo: { minWidth: "54px", textAlign: "center", fontSize: "14px", fontWeight: "700", color: "#334155" },
    emptyText: { margin: 0, color: "#94a3b8", fontSize: "14px" },
    message: { textAlign: "center", padding: "40px", color: "#64748b" },
    payButton: {
        padding: "9px 14px",
        borderRadius: "10px",
        border: "none",
        background: "#111827",
        color: "white",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "700",
        width: "100%",
        textAlign: "center",
    },
    paidButton: {
        padding: "9px 14px",
        borderRadius: "10px",
        border: "none",
        background: "#e2e8f0",
        color: "#64748b",
        cursor: "not-allowed",
        fontSize: "13px",
        fontWeight: "700",
        width: "100%",
        textAlign: "center",
    },
    waitButton: {
        padding: "9px 14px",
        borderRadius: "10px",
        border: "none",
        background: "#f1f5f9",
        color: "#94a3b8",
        cursor: "not-allowed",
        fontSize: "13px",
        fontWeight: "700",
        width: "100%",
        textAlign: "center",
    },
};
