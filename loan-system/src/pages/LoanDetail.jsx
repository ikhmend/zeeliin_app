import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getLoanDetail,
    getLoanInstallments,
    makeLoanPayment,
} from "../api/LoansApi";

const PAGE_SIZE = 5;

export default function LoanDetail() {
    const { loanId } = useParams();
    const navigate = useNavigate();

    const [loan, setLoan] = useState(null);
    const [installments, setInstallments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [payingId, setPayingId] = useState(null); 

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
        return { ...base, background: "#dbeafe", color: "#1d4ed8" };
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

const handlePayInstallment = async (installment) => {

    const remainingAmount = getInstallmentRemainingAmount(installment);

    if (!remainingAmount || remainingAmount <= 0) {
        alert("Төлөх дүн олдсонгүй.");
        return;
    }

    const method = window.prompt(
        "Төлбөрийн арга сонгоно уу:\n1 - Банкны шилжүүлэг\n2 - QPay\n3 - Карт"
        );

    const paymentMethodMap = {

        "1": "bank_transfer",
        "2": "qpay",
        "3": "card",
        };

    const paymentMethod = paymentMethodMap[String(method).trim()];

    if (!paymentMethod) {
        alert("Төлбөрийн арга буруу байна.");
        return;
    }

    const ok = window.confirm(
        `${formatMoney(remainingAmount, loan?.currency || "MNT")} төлөх үү?`
    );

    if (!ok) return;

    try {
        setPayingId(installment.id);

        const today = new Date().toISOString().slice(0, 10);

        await makeLoanPayment(loanId, {
        payment_amount: remainingAmount,
        payment_date: today,
        payment_method: paymentMethod,
        note: `Customer web payment. Installment ID: ${installment.id}`,
        });

        const [loanData, installmentData] = await Promise.all([
        getLoanDetail(loanId),
        getLoanInstallments(loanId),
        ]);

        setLoan(loanData);
        setInstallments(installmentData || []);
    } catch (err) {
        console.error("Make payment error:", err);
        alert(err.response?.data?.message || "Төлбөр хийх үед алдаа гарлаа");
    } finally {
        setPayingId(null);
    }
};
const totalPages = Math.max(
    1,
    Math.ceil(installments.length / PAGE_SIZE)
);

const paginatedInstallments = installments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
);

const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
};

const handleNextPage = () => {
    setCurrentPage((prev) =>
        Math.min(totalPages, prev + 1)
    );
};

    useEffect(() => {
        async function loadLoanDetail() {
            try {
                setLoading(true);
                setError("");

                const [loanData, installmentData] = await Promise.all([
                    getLoanDetail(loanId),
                    getLoanInstallments(loanId),
                ]);

                setLoan(loanData);
                setInstallments(installmentData || []);
                setCurrentPage(1);
            } catch (err) {
                console.error("Loan detail error:", err);
                setError(err.response?.data?.error || "Зээлийн мэдээлэл авахад алдаа гарлаа");
            } finally {
                setLoading(false);
            }
        }
        loadLoanDetail();
    }, [loanId]);

    if (loading) return <p style={styles.message}>Уншиж байна...</p>;
    if (error) return <p style={styles.message}>{error}</p>;
    if (!loan) return <p style={styles.message}>Зээлийн мэдээлэл олдсонгүй.</p>;

    const currency = getLoanValue("currency", "currency_code", "currencyCode") || "MNT";
    const loanProduct = getLoanValue("loan_product", "loanProduct", "loan_type", "product");
    const accountNumber = getLoanValue("account_no", "account_number", "accountNo");
    const startDate = getLoanValue("start_date", "startDate", "loan_start_date");
    const previousLoanBalance = getLoanValue("previous_loan_balance", "previousBalance");
    const interestRate = getLoanValue("interest_rate", "interestRate", "interest");
    const feePercent = getLoanValue("fee_percent", "feePercent", "fee_rate");
    const feeAmount = getLoanValue("fee_amount", "feeAmount", "commission_amount");

    return (
        <div style={styles.container}>
            <button style={styles.backButton} onClick={() => navigate("/loans")}>
                Буцах
            </button>

            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>
                        {loan.loan_code || loan.loanCode || `Зээл #${loan.id}`}
                    </h1>
                    <p style={styles.subText}>
                        Гэрээний дугаар: {loan.contract_no || loan.contractNo || "-"}
                    </p>
                </div>
                <span style={styles.status}>
                    {getStatusName(loan.loan_status || loan.status)}
                </span>
            </div>

            <div style={styles.cards}>
                <div style={styles.card}>
                    <p style={styles.cardLabel}>Зээлийн дүн</p>
                    <h2 style={styles.cardValue}>{formatMoney(loan.loan_amount || loan.amount, currency)}</h2>
                </div>
                <div style={styles.card}>
                    <p style={styles.cardLabel}>Хүү</p>
                    <h2 style={styles.cardValue}>{formatPercent(interestRate)}</h2>
                </div>
                <div style={styles.card}>
                    <p style={styles.cardLabel}>Хугацаа</p>
                    <h2 style={styles.cardValue}>{loan.duration_month || 0} сар</h2>
                </div>
                <div style={styles.card}>
                    <p style={styles.cardLabel}>Шимтгэл</p>
                    <h2 style={styles.cardValue}>{formatMoney(feeAmount, currency)}</h2>
                </div>
            </div>

            <div style={styles.grid}>
                <div style={styles.box}>
                    <h3 style={styles.boxTitle}>Зээлийн үндсэн мэдээлэл</h3>
                    <InfoRow label="Зээлийн төрөл" value={getProductName(loanProduct)} />
                    <InfoRow label="Дансны дугаар" value={accountNumber || "-"} />
                    <InfoRow label="Валют" value={currency || "-"} />
                    <InfoRow label="Эхэлсэн огноо" value={formatDate(startDate)} />
                    <InfoRow label="Өмнөх зээлийн үлдэгдэл" value={formatMoney(previousLoanBalance, currency)} />
                </div>

                <div style={styles.box}>
                    <h3 style={styles.boxTitle}>Хүү, шимтгэлийн мэдээлэл</h3>
                    <InfoRow label="Хүүгийн хувь" value={formatPercent(interestRate)} />
                    <InfoRow label="Шимтгэлийн хувь" value={formatPercent(feePercent)} />
                    <InfoRow label="Шимтгэлийн дүн" value={formatMoney(feeAmount, currency)} />
                </div>
            </div>

            <div style={styles.section}>
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
                                                        onClick={() => handlePayInstallment(item)}
                                                        disabled={payingId === item.id}
                                                    >
                                                        {payingId === item.id ? "Төлж байна..." : isPartial ? "Үлдэгдэл" : "Төлөх"}
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

                        <div style={styles.pagination}>
                            <button
                                style={{ ...styles.pageButton, ...(currentPage === 1 ? styles.disabledButton : {}) }}
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                            >
                                {"<"}
                            </button>
                            <span style={styles.pageInfo}>{currentPage} / {totalPages}</span>
                            <button
                                style={{ ...styles.pageButton, ...(currentPage === totalPages ? styles.disabledButton : {}) }}
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                            >
                                {">"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
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

const styles = {
    container: {
        padding: "16px 16px 24px 16px",
        maxWidth: "1200px",
        margin: "0 auto",
        boxSizing: "border-box",
    },
    backButton: {
        marginBottom: "18px",
        background: "transparent",
        border: "none",
        color: "#2563eb",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        padding: 0,
    },
    header: {
        background: "white",
        borderRadius: "16px",
        padding: "24px",
        border: "1px solid #f1f5f9",
        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "24px",
    },
    title: { margin: "0 0 8px 0", fontSize: "24px", color: "#0f172a" },
    subText: { margin: 0, color: "#64748b", fontSize: "14px" },
    status: {
        padding: "7px 14px",
        borderRadius: "999px",
        background: "#dcfce7",
        color: "#15803d",
        fontSize: "13px",
        fontWeight: "700",
        whiteSpace: "nowrap",
    },
    cards: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", // Гар утсанд автоматаар доошоо шилжинэ
        gap: "20px",
        marginBottom: "24px",
    },
    card: {
        background: "white",
        padding: "22px",
        borderRadius: "16px",
        border: "1px solid #f1f5f9",
        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
    },
    cardLabel: { margin: "0 0 8px 0", color: "#64748b", fontSize: "14px" },
    cardValue: { margin: 0, color: "#0f172a", fontSize: "18px", fontWeight: "700" },
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
        background: "#2563eb",
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