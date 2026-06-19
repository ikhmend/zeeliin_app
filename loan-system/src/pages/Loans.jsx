import { useEffect, useState } from "react";
import { getMyLoans } from "../api/LoansApi";
import { useNavigate } from "react-router-dom";

export default function Loans() {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const formatMoney = (amount, currency = "MNT") => {
        return new Intl.NumberFormat("mn-MN").format(Number(amount || 0)) + " " + currency;
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("mn-MN");
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
        return status || "-";
    };

    useEffect(() => {
        const loadLoans = async () => {
            try {
                const result = await getMyLoans();
                setLoans(result);
            } catch (error) {
                console.error("Loans error:", error);
            } finally {
                setLoading(false);
            }
        };

        loadLoans();
    }, []);

    if (loading) {
        return <p style={styles.message}>Уншиж байна...</p>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Миний зээлүүд</h1>

            {loans.length === 0 ? (
                <div style={styles.emptyBox}>
                    <p>Таны нэр дээр зээл бүртгэгдээгүй байна.</p>
                </div>
            ) : (
                <div style={styles.list}>
                    {loans.map((loan) => (
                        <div key={loan.id} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <div>
                                    <h3 style={styles.loanCode}>{loan.loan_code}</h3>
                                    <p style={styles.contractNo}>Гэрээ: {loan.contract_no}</p>
                                </div>

                                <span style={styles.status}>
                                    {getStatusName(loan.loan_status)}
                                </span>
                            </div>

                            <div style={styles.infoGrid}>
                                <div>
                                    <p style={styles.label}>Зээлийн төрөл</p>
                                    <p style={styles.value}>{getProductName(loan.loan_product)}</p>
                                </div>

                                <div>
                                    <p style={styles.label}>Зээлийн дүн</p>
                                    <p style={styles.value}>
                                        {formatMoney(loan.loan_amount, loan.currency)}
                                    </p>
                                </div>

                                <div>
                                    <p style={styles.label}>Хүү</p>
                                    <p style={styles.value}>{loan.interest_rate}%</p>
                                </div>

                                <div>
                                    <p style={styles.label}>Хугацаа</p>
                                    <p style={styles.value}>{loan.duration_month} сар</p>
                                </div>

                                <div>
                                    <p style={styles.label}>Шимтгэл</p>
                                    <p style={styles.value}>
                                        {formatMoney(loan.fee_amount, loan.currency)}
                                    </p>
                                </div>

                                <div>
                                    <p style={styles.label}>Эхэлсэн огноо</p>
                                    <p style={styles.value}>{formatDate(loan.start_date)}</p>
                                </div>

                                <div>
                                    <p style={styles.label}>Дансны дугаар</p>
                                    <p style={styles.value}>{loan.account_no}</p>
                                </div>

                                <div>
                                    <p style={styles.label}>Валют</p>
                                    <p style={styles.value}>{loan.currency}</p>
                                </div>
                            </div>

                            {/* Action Button Section fixed inside the map block */}
                            <div style={styles.cardActions}>
                                <button
                                    style={styles.detailButton}
                                    onClick={() => navigate(`/loans/${loan.id}`)}
                                >
                                    Дэлгэрэнгүй
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: "0 16px 24px 16px",
        maxWidth: "1200px",
        margin: "0 auto",
    },
    title: {
        margin: "0 0 20px 0",
        fontSize: "24px",
        fontWeight: "600",
        color: "#0f172a",
    },
    list: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    card: {
        background: "white",
        borderRadius: "16px",
        padding: "22px",
        border: "1px solid #f1f5f9",
        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "20px",
    },
    loanCode: {
        margin: "0 0 6px 0",
        fontSize: "18px",
        fontWeight: "600",
        color: "#0f172a",
    },
    contractNo: {
        margin: 0,
        fontSize: "14px",
        color: "#64748b",
    },
    status: {
        padding: "6px 12px",
        borderRadius: "999px",
        background: "#dcfce7",
        color: "#15803d",
        fontSize: "13px",
        fontWeight: "500",
    },
    infoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "18px",
    },
    label: {
        margin: "0 0 6px 0",
        fontSize: "14px",
        color: "#64748b",
    },
    value: {
        margin: 0,
        fontSize: "16px",
        color: "#0f172a",
        fontWeight: "500",
    },
    emptyBox: {
        background: "white",
        borderRadius: "16px",
        padding: "24px",
        color: "#64748b",
        border: "1px solid #f1f5f9",
    },
    message: {
        textAlign: "center",
        padding: "40px",
        color: "#64748b",
    },
    cardActions: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "20px",
        paddingTop: "16px",
        borderTop: "1px solid #f1f5f9",
    },
    detailButton: {
    padding: "8px 16px",
    background: "transparent",          
    color: "#2563eb",               
    border: "1px solid #2563eb",    
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",    
},
};