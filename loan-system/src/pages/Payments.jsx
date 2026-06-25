import { useEffect, useState } from "react";
import { getMyPayments } from "../api/LoansApi";

const PAGE_SIZE = 5;
export default function Payments() {
    const [payments, setPayments] = useState([]);
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

    const getValue = (obj, ...keys) => {
        for (const key of keys) {
            const value = key
                .split(".")
                .reduce((current, part) => current?.[part], obj);

            if (value !== undefined && value !== null && value !== "") {
                return value;
            }
        }

        return null;
    };

    const getStatusName = (status) => {
        if (status === "paid") return "Төлөгдсөн";
        if (status === "success") return "Амжилттай";
        if (status === "completed") return "Дууссан";
        if (status === "pending") return "Хүлээгдэж байна";
        if (status === "failed") return "Амжилтгүй";
        if (status === "cancelled") return "Цуцлагдсан";

        return status || "Төлөгдсөн";
    };

    const getStatusStyle = (status) => {
        const base = {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "96px",
            padding: "7px 12px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: "700",
        };

        if (
            status === "paid" ||
            status === "success" ||
            status === "completed" ||
            !status
        ) {
            return {
                ...base,
                background: "#dcfce7",
                color: "#15803d",
            };
        }

        if (status === "failed" || status === "cancelled") {
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

    const getMethodName = (method) => {
        if (method === "cash") return "Бэлэн";
        if (method === "bank") return "Банк";
        if (method === "transfer") return "Шилжүүлэг";
        if (method === "card") return "Карт";
        if (method === "qpay") return "QPay";

        return method || "-";
    };

    useEffect(() => {
        async function loadPayments() {
            try {
                setLoading(true);
                setError("");

                const data = await getMyPayments();

                console.log("PAYMENTS FINAL:", data);

                setPayments(data || []);
                setCurrentPage(1);
            } catch (err) {
                console.error("Payments error:", err);
                console.error("Payments response:", err.response?.data);

                setError(
                    err.response?.data?.error ||
                    err.response?.data?.message ||
                    err.message ||
                    "Төлбөрийн түүх авахад алдаа гарлаа"
                );
            } finally {
                setLoading(false);
            }
        }

        loadPayments();
    }, []);

    const totalPages = Math.max(1, Math.ceil(payments.length / PAGE_SIZE));

    const paginatedPayments = payments.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(1, prev - 1));
    };
    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    };

    const totalPaidAmount = payments.reduce((sum, payment) => {
        const amount = getValue(
            payment,
            "payment_amount",
            "paymentAmount",
            "paid_amount",
            "paidAmount",
            "amount",
            "total_amount",
            "totalAmount"
        );

        return sum + Number(amount || 0);
    }, 0);

    if (loading) {
        return <p style={styles.message}>Уншиж байна...</p>;
    }

    if (error) {
        return <p style={styles.message}>{error}</p>;
    }

    return (
        <div style={styles.container} className="page-container">

            <div style={styles.cards} className="responsive-cards two-card-grid">
                <div style={styles.card} className="responsive-card">
                    <p style={styles.cardLabel}>Нийт төлөлт</p>
                    <h2 style={styles.cardValue}>{payments.length}</h2>
                </div>

                <div style={styles.card} className="responsive-card">
                    <p style={styles.cardLabel}>Нийт төлсөн дүн</p>
                    <h2 style={styles.cardValue}>
                        {formatMoney(totalPaidAmount, "MNT")}
                    </h2>
                </div>
            </div>

            <div style={styles.section} className="responsive-card responsive-section">
                <div style={styles.sectionHeader} className="responsive-card-header">
                    <div>
                        <h3 style={styles.boxTitle}>Төлөлтийн жагсаалт</h3>
                        <p style={styles.sectionSubText}>
                            Нийт {payments.length} төлөлт байна
                        </p>
                    </div>
                </div>

                {payments.length === 0 ? (
                    <p style={styles.emptyText}>
                        Төлбөрийн түүх байхгүй байна.
                    </p>
                ) : (
                    <>
                        <div style={styles.table} className="responsive-table">
                            <div style={styles.tableHeader5} className="responsive-table-row table-5">
                                <span>Огноо</span>
                                <span>Зээл</span>
                                <span>Төлсөн дүн</span>
                                <span>Төлбөрийн арга</span>
                                <span>Төлөв</span>
                            </div>

                            {paginatedPayments.map((payment, index) => {
                                const paymentDate = getValue(
                                    payment,
                                    "payment_date",
                                    "paymentAmount",
                                    "paid_amount",
                                    "paidAmount",
                                    "amount",
                                    "total_amount",
                                    "totalAmount"
                                );

                                const paymentAmount = getValue(
                                    payment,
                                    "payment_amount",
                                    "paymentAmount",
                                    "paid_amount",
                                    "paidAmount",
                                    "amount",
                                    "total_amount",
                                    "totalAmount"
                                );

                                const currency =
                                    getValue(
                                        payment,
                                        "currency",
                                        "loan.currency"
                                    ) || "MNT";

                                const loanName =
                                    getValue(
                                        payment,
                                        "loan_code",
                                        "loanCode",
                                        "loan.loan_code",
                                        "loan.loanCode",
                                        "contract_no",
                                        "contractNo",
                                        "loan.contract_no",
                                        "loan.contractNo"
                                    ) ||
                                    `Зээл #${
                                        getValue(
                                            payment,
                                            "loan_id",
                                            "loanId",
                                            "loan.id"
                                        ) || "-"
                                    }`;

                                const method = getValue(
                                    payment,
                                    "payment_method",
                                    "paymentMethod",
                                    "method",
                                    "type"
                                );

                                const status = getValue(
                                    payment,
                                    "status",
                                    "payment_status",
                                    "paymentStatus"
                                );

                                return (
                                    <div
                                        key={payment.id || index}
                                        style={styles.tableRow5} className="responsive-table-row table-5"
                                    >
                                        <span>{formatDate(paymentDate)}</span>

                                        <span style={styles.loanText}>
                                            {loanName}
                                        </span>

                                        <span style={styles.moneyText}>
                                            {formatMoney(paymentAmount, currency)}
                                        </span>

                                        <span>{getMethodName(method)}</span>

                                        <span>
                                            <span style={getStatusStyle(status)}>
                                                {getStatusName(status)}
                                            </span>
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={styles.pagination} className="responsive-pagination">
                            <button
                                style={{
                                    ...styles.pageButton,
                                    ...(currentPage === 1
                                        ? styles.disabledButton
                                        : {}),
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

const styles = {
    container: {
        padding: "0 16px 24px 16px",
        maxWidth: "1200px",
        margin: "0 auto",
    },

    cards: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
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
        fontSize: "20px",
        fontWeight: "500",
    },

    section: {
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
        alignItems: "center",
        marginBottom: "14px",
    },

    boxTitle: {
        margin: "0 0 18px 0",
        fontSize: "18px",
        color: "#0f172a",
        fontWeight: "500",
    },

    sectionSubText: {
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

    tableHeader5: {
        display: "grid",
        gridTemplateColumns: "1fr 1.1fr 1.2fr 1fr 1fr",
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
        gridTemplateColumns: "1fr 1.1fr 1.2fr 1fr 1fr",
        gap: "12px",
        alignItems: "center",
        padding: "16px 18px",
        borderTop: "1px solid #f1f5f9",
        fontSize: "14px",
        color: "#0f172a",
    },

    loanText: {
        fontWeight: "500",
    },

    moneyText: {
        fontWeight: "500",
        color: "#0f172a",
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