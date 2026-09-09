import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import getDashboardData from "../api/DashboardApi";
import StateMessage from "../components/StateMessage";

export default function Dashboard() {
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const formatMoney = (amount) => {
        return new Intl.NumberFormat("mn-MN").format(Number(amount) || 0) + "₮";
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("mn-MN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                const result = await getDashboardData();

                setData(result);
            } catch (error) {

                setError(
                    error.response?.data?.error ||
                    error.response?.data?.message ||
                    error.message ||
                    "Dashboard мэдээлэл авахад алдаа гарлаа"
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return <StateMessage type="loading" title="Уншиж байна" message="Dashboard мэдээллийг ачаалж байна." />;
    }

    if (error) {
        return <StateMessage type="error" title="Алдаа гарлаа" message={error} />;
    }

    if (!data) {
        return <StateMessage title="Мэдээлэл олдсонгүй" message="Таны dashboard мэдээлэл одоогоор байхгүй байна." />;
    }

    const {
        customer,
        loan,
        schedule = [],
        recentPayments = [],
        paymentStatusSummary = { paid: 0, unpaid: 0, overdue: 0 },
    } = data;
    const paymentStatusData = [
        { name: "Төлсөн", value: paymentStatusSummary.paid, fill: "#111827" },
        { name: "Төлөөгүй", value: paymentStatusSummary.unpaid, fill: "#6b7280" },
        { name: "Хугацаа хэтэрсэн", value: paymentStatusSummary.overdue, fill: "#d1d5db" },
    ];
    const nextInstallment = schedule[0];
    const nextDueDate = nextInstallment?.due_date || loan.nextPaymentDate;
    const daysUntilPayment = getDaysUntil(nextDueDate);
    const hasUpcomingPayment = Boolean(nextInstallment || daysUntilPayment !== null);
    const isOverdue = nextInstallment?.status === "overdue" || (daysUntilPayment !== null && daysUntilPayment < 0);
    const paymentAlertTitle = !hasUpcomingPayment
        ? "Төлөлтийн хуваарь байхгүй байна"
        : isOverdue
        ? "Танд хугацаа хэтэрсэн зээл байна"
        : "Дараагийн төлөлт ойртож байна";
    const paymentAlertText = isOverdue
        ? `Хугацаа хэтэрсэн дүн: ${formatMoney(nextInstallment?.remaining_amount || loan.monthlyPayment)}`
        : daysUntilPayment === null
            ? "Төлөлтийн хуваарь одоогоор байхгүй байна."
            : daysUntilPayment === 0
            ? `Танд өнөөдөр ${formatMoney(loan.monthlyPayment)} төлөлт байна.`
            : `Танд ${daysUntilPayment} хоногийн дараа ${formatMoney(loan.monthlyPayment)} төлөлт байна.`;

    return (
        <div style={styles.container} className="page-container">
            <h1 style={styles.mainTitle}>
                Сайн байна уу, {customer.fullName}
            </h1>

            <p style={styles.subText}>
                Та өөрийн зээл болон төлөлтийн мэдээллээ хялбар байдлаар удирдаарай.
            </p>

            <div style={styles.cards} className="responsive-cards dashboard-cards">
                <div style={styles.card} className="responsive-card">
                    <p style={styles.cardLabel}>Үлдэгдэл төлбөр/Нийт зээл/</p>
                    <h2 style={styles.cardValue}>
                        {formatMoney(loan.remainingAmount)}
                    </h2>
                </div>

                <div style={styles.card} className="responsive-card">
                    <p style={styles.cardLabel}>Дараагийн төлөлт</p>
                    <h2 style={styles.cardValue}>
                        {formatMoney(loan.monthlyPayment)}
                    </h2>
                </div>

                <div style={styles.card} className="responsive-card">
                    <p style={styles.cardLabel}>Төлөх огноо</p>
                    <h2 style={styles.cardValue}>
                        {loan.nextPaymentDate || "-"}
                    </h2>
                </div>

                <div style={styles.card} className="responsive-card">
                    <p style={styles.cardLabel}>Идэвхтэй зээл</p>
                    <h2 style={styles.cardValue}>
                        {loan.activeLoansCount || 0}
                    </h2>
                </div>
            </div>

            <div style={styles.paymentAlert} className="responsive-alert">
                <div>
                    <h3 style={styles.alertTitle}>
                        {paymentAlertTitle}
                    </h3>

                    <p style={styles.alertText}>
                        {paymentAlertText}
                    </p>
                </div>

                <button
                    style={styles.alertButton}
                    onClick={() => navigate(nextInstallment?.loan_id ? `/loans/${nextInstallment.loan_id}` : "/loans")}
                >
                    Дэлгэрэнгүй харах
                </button>
            </div>

            <div style={styles.chartBox} className="responsive-card responsive-box">
                <h3 style={styles.boxTitle}>Төлөлтийн төлөв</h3>
                <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                        <Tooltip />
                        <Legend />
                        <Pie data={paymentStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div style={styles.grid} className="responsive-grid two-col-grid">
                <div style={styles.box} className="responsive-card responsive-box">
                    <h3 style={styles.boxTitle}>Төлөлтийн хуваарь</h3>

                    {schedule.length === 0 ? (
                        <p style={styles.emptyText}>
                            Төлөлтийн хуваарь байхгүй байна.
                        </p>
                    ) : (
                        schedule.slice(0, 3).map((item, index) => (
                            <div key={index} style={styles.row} className="responsive-row">
                                <span style={styles.rowDate}>
                                    {formatDate(item.due_date)}
                                </span>

                                <strong style={styles.rowAmount}>
                                    {formatMoney(item.remaining_amount)}
                                </strong>
                            </div>
                        ))
                    )}

                    <button
                        style={styles.linkButton}
                        onClick={() => navigate(schedule[0]?.loan_id ? `/loans/${schedule[0].loan_id}` : "/loans")}
                    >
                        Дэлгэрэнгүй харах
                    </button>
                </div>

                <div style={styles.box} className="responsive-card responsive-box">
                    <h3 style={styles.boxTitle}>Сүүлд хийсэн төлөлтүүд</h3>

                    {recentPayments.length === 0 ? (
                        <p style={styles.emptyText}>
                            Сүүлийн төлөлт байхгүй байна.
                        </p>
                    ) : (
                        recentPayments.slice(0, 3).map((item, index) => (
                            <div key={index} style={styles.row} className="responsive-row">
                                <span style={styles.rowDate}>
                                    {formatDate(item.payment_date)}
                                </span>

                                <strong style={styles.rowAmount}>
                                    {formatMoney(item.payment_amount)}
                                </strong>
                            </div>
                        ))
                    )}

                    <button
                        style={styles.linkButton}
                        onClick={() => navigate("/payments")}
                    >
                        Бүгдийг харах
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: "0 16px 24px 16px",
        maxWidth: "1200px",
        margin: "0 auto",
    },

    mainTitle: {
        fontSize: "28px",
        fontWeight: "700",
        color: "#0f172a",
        letterSpacing: "-0.5px",
        margin: "0 0 20px 0",
    },

    subText: {
        fontSize: "15px",
        color: "#64748b",
        margin: "0 0 32px 0",
    },

    cards: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        marginBottom: "24px",
    },

    card: {
        background: "white",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
        border: "1px solid #f1f5f9",
    },

    cardLabel: {
        margin: "0 0 7px 0",
        fontSize: "14px",
        fontWeight: "400",
        color: "#64748b",
        letterSpacing: "0",
    },

    cardValue: {
        margin: 0,
        fontSize: "18px",
        fontWeight: "600",
        color: "#0f172a",
        letterSpacing: "-0.2px",
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "28px",
    },

    box: {
        background: "white",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
        border: "1px solid #f1f5f9",
    },

    boxTitle: {
        margin: "0 0 16px 0",
        fontSize: "15px",
        fontWeight: "500",
        color: "#0f172a",
        letterSpacing: "-0.3px",
    },

    row: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 0",
        borderBottom: "1px solid #f1f5f9",
    },

    rowDate: {
        fontSize: "14px",
        color: "#475569",
        fontWeight: "400",
    },

    rowAmount: {
        fontSize: "15px",
        color: "#0f172a",
        fontWeight: "600",
    },

    linkButton: {
        marginTop: "20px",
        background: "transparent",
        border: "none",
        color: "#111827",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        padding: 0,
    },

    loadingText: {
        textAlign: "center",
        padding: "40px",
        color: "#64748b",
        fontSize: "16px",
    },

    paymentAlert: {
        background: "#f3f4f6",
        border: "1px solid #d1d5db",
        borderRadius: "14px",
        padding: "20px 22px",
        marginBottom: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
    },

    chartBox: {
        background: "white",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
        border: "1px solid #f1f5f9",
        marginBottom: "28px",
    },

    alertTitle: {
        margin: "0 0 8px 0",
        fontSize: "18px",
        fontWeight: "700",
        color: "#111827",
    },

    alertText: {
        margin: 0,
        fontSize: "15px",
        color: "#334155",
        lineHeight: "1.5",
    },

    alertButton: {
        padding: "11px 22px",
        background: "#111827",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "700",
        whiteSpace: "nowrap",
    },

    emptyText: {
        margin: "12px 0",
        fontSize: "14px",
        color: "#94a3b8",
    },
};

function getDaysUntil(dateValue) {
    if (!dateValue || dateValue === "-") return null;
    const [year, month, day] = String(dateValue).slice(0, 10).split("-").map(Number);
    if (![year, month, day].every(Number.isFinite)) return null;
    const due = Date.UTC(year, month - 1, day);
    const today = new Date();
    const current = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    return Math.ceil((due - current) / 86400000);
}
