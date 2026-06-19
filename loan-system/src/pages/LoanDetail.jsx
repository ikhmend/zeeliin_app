import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getLoanDetail,
    getLoanInstallments,
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
        if (status === "overdue") return "Хугацаа хэтэрсэн";
        return status || "-";
    };

    const getInstallmentStatusStyle = (status) => {
        const base = {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "92px",
            padding: "7px 12px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: "700",
        };

        if (status === "paid") {
            return {
                ...base,
                background: "#dcfce7",
                color: "#15803d",
            };
        }

        if (status === "overdue") {
            return {
                ...base,
                background: "#fee2e2",
                color: "#b91c1c",
            };
        }

        return {
            ...base,
            background: "#dbeafe",
            color: "#1d4ed8",
        };
    };

    const totalPages = Math.max(1, Math.ceil(installments.length / PAGE_SIZE));

    const paginatedInstallments = installments.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(1, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(totalPages, prev + 1));
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

                console.log("LOAN DETAIL FINAL:", loanData);
                console.log("INSTALLMENTS FINAL:", installmentData);

                setLoan(loanData);
                setInstallments(installmentData || []);
                setCurrentPage(1);
            } catch (err) {
                console.error("Loan detail error:", err);
                console.error("Loan detail response:", err.response?.data);

                setError(
                    err.response?.data?.error ||
                    err.response?.data?.message ||
                    err.message ||
                    "Зээлийн дэлгэрэнгүй мэдээлэл авахад алдаа гарлаа"
                );
            } finally {
                setLoading(false);
            }
        }

        loadLoanDetail();
    }, [loanId]);

    if (loading) {
        return <p style={styles.message}>Уншиж байна...</p>;
    }

    if (error) {
        return <p style={styles.message}>{error}</p>;
    }

    if (!loan) {
        return <p style={styles.message}>Зээлийн мэдээлэл олдсонгүй.</p>;
    }

    const currency = getLoanValue("currency", "currency_code", "currencyCode") || "MNT";

    const loanProduct = getLoanValue(
        "loan_product",
        "loanProduct",
        "loan_type",
        "loanType",
        "product",
        "type"
    );

    const accountNumber = getLoanValue(
        "account_no",
        "account_number",
        "accountNo",
        "accountNumber",
        "loan_account",
        "loanAccount"
    );

    const startDate = getLoanValue(
        "start_date",
        "startDate",
        "loan_start_date",
        "loanStartDate",
        "issued_date",
        "issuedDate"
    );

    const previousLoanBalance = getLoanValue(
        "previous_loan_balance",
        "previousLoanBalance",
        "previous_balance",
        "previousBalance",
        "old_loan_balance",
        "oldLoanBalance"
    );

    const interestRate = getLoanValue(
        "interest_rate",
        "interestRate",
        "interest",
        "monthly_interest_rate",
        "monthlyInterestRate"
    );

    const feePercent = getLoanValue(
        "fee_percent",
        "feePercent",
        "fee_rate",
        "feeRate",
        "commission_rate",
        "commissionRate",
        "service_fee_rate",
        "serviceFeeRate"
    );

    const feeAmount = getLoanValue(
        "fee_amount",
        "feeAmount",
        "commission_amount",
        "commissionAmount",
        "service_fee_amount",
        "serviceFeeAmount"
    );

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
                        Гэрээний дугаар:{" "}
                        {loan.contract_no || loan.contractNo || "-"}
                    </p>
                </div>

                <span style={styles.status}>
                    {getStatusName(
                        loan.loan_status ||
                        loan.loanStatus ||
                        loan.status
                    )}
                </span>
            </div>

            <div style={styles.cards}>
                <div style={styles.card}>
                    <p style={styles.cardLabel}>Зээлийн дүн</p>
                    <h2 style={styles.cardValue}>
                        {formatMoney(
                            loan.loan_amount ||
                            loan.loanAmount ||
                            loan.amount,
                            currency
                        )}
                    </h2>
                </div>

                <div style={styles.card}>
                    <p style={styles.cardLabel}>Хүү</p>
                    <h2 style={styles.cardValue}>
                        {formatPercent(interestRate)}
                    </h2>
                </div>

                <div style={styles.card}>
                    <p style={styles.cardLabel}>Хугацаа</p>
                    <h2 style={styles.cardValue}>
                        {loan.duration_month ||
                            loan.durationMonth ||
                            loan.duration_months ||
                            loan.durationMonths ||
                            0}{" "}
                        сар
                    </h2>
                </div>

                <div style={styles.card}>
                    <p style={styles.cardLabel}>Шимтгэл</p>
                    <h2 style={styles.cardValue}>
                        {formatMoney(feeAmount, currency)}
                    </h2>
                </div>
            </div>

            <div style={styles.grid}>
                <div style={styles.box}>
                    <h3 style={styles.boxTitle}>Зээлийн үндсэн мэдээлэл</h3>

                    <InfoRow
                        label="Зээлийн төрөл"
                        value={getProductName(loanProduct)}
                    />

                    <InfoRow
                        label="Дансны дугаар"
                        value={accountNumber || "-"}
                    />

                    <InfoRow
                        label="Валют"
                        value={currency || "-"}
                    />

                    <InfoRow
                        label="Эхэлсэн огноо"
                        value={formatDate(startDate)}
                    />

                    <InfoRow
                        label="Өмнөх зээлийн үлдэгдэл"
                        value={formatMoney(previousLoanBalance, currency)}
                    />
                </div>

                <div style={styles.box}>
                    <h3 style={styles.boxTitle}>Хүү, шимтгэлийн мэдээлэл</h3>

                    <InfoRow
                        label="Хүүгийн хувь"
                        value={formatPercent(interestRate)}
                    />

                    <InfoRow
                        label="Шимтгэлийн хувь"
                        value={formatPercent(feePercent)}
                    />

                    <InfoRow
                        label="Шимтгэлийн дүн"
                        value={formatMoney(feeAmount, currency)}
                    />
                </div>
            </div>

            <div style={styles.section}>
                <div style={styles.scheduleHeader}>
                    <div>
                        <h3 style={styles.boxTitle}>Төлөлтийн хуваарь</h3>
                        <p style={styles.scheduleSubText}>
                            Нийт {installments.length} төлөлт байна
                        </p>
                    </div>
                </div>

                {installments.length === 0 ? (
                    <p style={styles.emptyText}>Төлөлтийн хуваарь байхгүй байна.</p>
                ) : (
                    <>
                        <div style={styles.table}>
                            <div style={styles.tableHeader4}>
                                <span>Огноо</span>
                                <span>Төлөх дүн</span>
                                <span>Үлдэгдэл</span>
                                <span>Төлөв</span>
                            </div>

                            {paginatedInstallments.map((item, index) => {
                                const dueDate =
                                    item.due_date ||
                                    item.dueDate ||
                                    item.payment_date ||
                                    item.paymentDate;

                                const totalAmount =
                                    item.total_amount ??
                                    item.totalAmount ??
                                    item.payment_amount ??
                                    item.paymentAmount ??
                                    item.installment_amount ??
                                    item.installmentAmount ??
                                    item.amount;

                                const remainingAmount =
                                    item.remaining_amount ??
                                    item.remainingAmount ??
                                    item.balance_after_payment ??
                                    item.balanceAfterPayment;

                                const status =
                                    item.status ||
                                    item.installment_status ||
                                    item.installmentStatus;

                                return (
                                    <div key={item.id || index} style={styles.tableRow4}>
                                        <span>{formatDate(dueDate)}</span>

                                        <span style={styles.moneyText}>
                                            {formatMoney(totalAmount, currency)}
                                        </span>

                                        <span style={styles.moneyText}>
                                            {formatMoney(remainingAmount, currency)}
                                        </span>

                                        <span>
                                            <span style={getInstallmentStatusStyle(status)}>
                                                {getInstallmentStatusName(status)}
                                            </span>
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={styles.pagination}>
                            <button
                                style={{
                                    ...styles.pageButton,
                                    ...(currentPage === 1 ? styles.disabledButton : {}),
                                }}
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                            >
                                {"<"}
                            </button>

                            <span style={styles.pageInfo}>
                                {currentPage} / {totalPages}
                            </span>

                            <button
                                style={{
                                    ...styles.pageButton,
                                    ...(currentPage === totalPages
                                        ? styles.disabledButton
                                        : {}),
                                }}
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
        padding: "0 16px 24px 16px",
        maxWidth: "1200px",
        margin: "0 auto",
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

    title: {
        margin: "0 0 8px 0",
        fontSize: "28px",
        color: "#0f172a",
    },

    subText: {
        margin: 0,
        color: "#64748b",
        fontSize: "15px",
    },

    status: {
        padding: "7px 14px",
        borderRadius: "999px",
        background: "#dcfce7",
        color: "#15803d",
        fontSize: "13px",
        fontWeight: "500",
        whiteSpace: "nowrap",
    },

    cards: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
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

    cardLabel: {
        margin: "0 0 8px 0",
        color: "#64748b",
        fontSize: "14px",
    },

    cardValue: {
        margin: 0,
        color: "#0f172a",
        fontSize: "18px",
        fontWeight: "500",
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
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

    boxTitle: {
        margin: "0 0 18px 0",
        fontSize: "18px",
        color: "#0f172a",
        fontWeight: "500",
    },

    infoRow: {
        display: "flex",
        justifyContent: "space-between",
        gap: "16px",
        padding: "12px 0",
        borderBottom: "1px solid #f1f5f9",
    },

    infoLabel: {
        color: "#64748b",
        fontSize: "14px",
    },

    infoValue: {
        color: "#0f172a",
        fontSize: "14px",
        textAlign: "right",
    },

    scheduleHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "14px",
    },

    scheduleSubText: {
        margin: "-10px 0 0 0",
        color: "#64748b",
        fontSize: "14px",
    },

    table: {
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
        overflow: "hidden",
        background: "#ffffff",
    },

    tableHeader4: {
        display: "grid",
        gridTemplateColumns: "1.1fr 1.2fr 1.2fr 1fr",
        gap: "12px",
        background: "#f8fafc",
        padding: "16px 18px",
        fontSize: "13px",
        fontWeight: ":00",
        color: "#475569",
        borderBottom: "1px solid #e2e8f0",
    },

    tableRow4: {
        display: "grid",
        gridTemplateColumns: "1.1fr 1.2fr 1.2fr 1fr",
        gap: "12px",
        alignItems: "center",
        padding: "16px 18px",
        borderTop: "1px solid #f1f5f9",
        fontSize: "14px",
        color: "#0f172a",
    },

    moneyText: {
        fontWeight: "500",
    },

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

    disabledButton: {
        opacity: 0.45,
        cursor: "not-allowed",
    },

    pageInfo: {
        minWidth: "54px",
        textAlign: "center",
        fontSize: "14px",
        fontWeight: "700",
        color: "#334155",
    },

    emptyText: {
        margin: 0,
        color: "#94a3b8",
        fontSize: "14px",
    },

    message: {
        textAlign: "center",
        padding: "40px",
        color: "#64748b",
    },
};