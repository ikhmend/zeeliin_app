import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLoanDetail, getLoanInstallments, makeLoanPayment } from "../api/LoansApi";

const formatMoney = (amount, currency) =>
  `${new Intl.NumberFormat("mn-MN", { maximumFractionDigits: 2 }).format(Number(amount) || 0)} ${currency || "MNT"}`;

export default function MakePayment() {
  const { loanId } = useParams();
  const navigate = useNavigate();
  const [loan, setLoan] = useState(null);
  const [installments, setInstallments] = useState([]);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank_transfer");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const totalRemaining = installments.reduce(
    (sum, installment) => sum + Number(installment.remaining_amount || 0),
    0,
  );
  const currency = loan?.currency || "MNT";

  useEffect(() => {
    Promise.all([getLoanDetail(loanId), getLoanInstallments(loanId)])
      .then(([loanData, installmentData]) => {
        setLoan(loanData);
        setInstallments(installmentData || []);
      })
      .catch((requestError) => setError(requestError.response?.data?.message || "Зээлийн мэдээлэл авахад алдаа гарлаа."))
      .finally(() => setLoading(false));
  }, [loanId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const paymentAmount = Number(amount);
    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) return setError("Төлөх дүн 0-ээс их байна.");
    if (paymentAmount > totalRemaining) return setError("Зээлийн нийт үлдэгдлээс их дүн төлөх боломжгүй.");

    try {
      setSubmitting(true);
      setError("");
      await makeLoanPayment(loanId, { payment_amount: paymentAmount, payment_method: method });
      navigate(`/loans/${loanId}#payment-schedule`, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Төлбөр хийх үед алдаа гарлаа.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p style={styles.message}>Уншиж байна...</p>;
  if (!loan) return <p style={styles.message}>{error || "Зээл олдсонгүй."}</p>;

  return (
    <div style={styles.container} className="page-container">
      <button type="button" style={styles.backButton} onClick={() => navigate(`/loans/${loanId}`)}>← Зээл рүү буцах</button>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h1 style={styles.title}>Төлбөр төлөх</h1>
        <p style={styles.loanCode}>{loan.loan_code || `Зээл #${loan.id}`}</p>
        <div style={styles.balance}>
          <span>Зээлийн нийт үлдэгдэл</span>
          <strong>{formatMoney(totalRemaining, currency)}</strong>
        </div>

        <label style={styles.label} htmlFor="payment-amount">Төлөх дүн</label>
        <input
          id="payment-amount"
          type="number"
          min="0.01"
          max={totalRemaining}
          step="0.01"
          required
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          style={styles.input}
          placeholder="0.00"
        />

        <label style={styles.label} htmlFor="payment-method">Төлбөрийн арга</label>
        <select id="payment-method" value={method} onChange={(event) => setMethod(event.target.value)} style={styles.input}>
          <option value="bank_transfer">Банкны шилжүүлэг</option>
          <option value="qpay">QPay</option>
          <option value="card">Карт</option>
        </select>

        {error && <div style={styles.error}>{error}</div>}
        <button type="submit" style={styles.submit} disabled={submitting || totalRemaining <= 0}>
          {submitting ? "Төлж байна..." : "Төлбөр төлөх"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: 760, margin: "0 auto", padding: "24px 16px" },
  card: { display: "flex", flexDirection: "column", padding: 28, borderRadius: 16, background: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 8px 30px rgba(15, 23, 42, 0.06)" },
  backButton: { marginBottom: 18, padding: 0, border: 0, background: "transparent", color: "#2563eb", cursor: "pointer", font: "inherit", textAlign: "left" },
  title: { margin: "0 0 6px", fontSize: 26, color: "#0f172a" },
  loanCode: { margin: "0 0 24px", color: "#64748b" },
  balance: { display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 24, padding: 18, borderRadius: 12, background: "#eff6ff", color: "#1e3a8a" },
  label: { marginBottom: 8, color: "#334155", fontSize: 14, fontWeight: 600 },
  input: { width: "100%", height: 46, marginBottom: 20, padding: "0 12px", border: "1px solid #cbd5e1", borderRadius: 10, font: "inherit" },
  error: { marginBottom: 18, padding: 12, borderRadius: 10, background: "#fee2e2", color: "#b91c1c" },
  submit: { width: "100%", padding: "13px 16px", border: 0, borderRadius: 10, background: "#2563eb", color: "#fff", cursor: "pointer", font: "inherit", fontWeight: 700 },
  message: { padding: 40, textAlign: "center", color: "#64748b" },
};
