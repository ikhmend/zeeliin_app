import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLoanDetail, getLoanInstallments, makeLoanPayment } from "../api/LoansApi";
import StateMessage from "../components/StateMessage";

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

  useEffect(() => {
    Promise.all([getLoanDetail(loanId), getLoanInstallments(loanId)])
      .then(([loanData, installmentData]) => {
        setLoan(loanData);
        setInstallments(installmentData || []);
      })
      .catch((requestError) => setError(requestError.response?.data?.message || "Зээлийн мэдээлэл авахад алдаа гарлаа."))
      .finally(() => setLoading(false));
  }, [loanId]);

  const currency = loan?.currency || "MNT";
  const totalRemaining = installments.reduce((sum, item) => sum + Number(item.remaining_amount || 0), 0);

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
      setError(requestError.response?.data?.message || "Төлөлт бүртгэх үед алдаа гарлаа.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <StateMessage type="loading" title="Уншиж байна" message="Төлөлтийн мэдээллийг ачаалж байна." />;
  if (error && !loan) return <StateMessage type="error" title="Алдаа гарлаа" message={error} />;
  if (!loan) return <StateMessage title="Зээл олдсонгүй" message="Сонгосон зээлийн мэдээлэл байхгүй байна." />;

  return (
    <div style={styles.container} className="page-container">
      <button type="button" style={styles.backButton} onClick={() => navigate(`/loans/${loanId}`)}>
        Буцах
      </button>

      <form style={styles.card} onSubmit={handleSubmit}>
        <h1 style={styles.title}>Төлөлт бүртгэх</h1>
        <p style={styles.subText}>{loan.loan_code || `Зээл #${loan.id}`}</p>

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

        <label style={styles.label} htmlFor="payment-method">Төлбөрийн хэлбэр</label>
        <select id="payment-method" value={method} onChange={(event) => setMethod(event.target.value)} style={styles.input}>
          <option value="bank_transfer">Банкны шилжүүлэг</option>
          <option value="cash">Бэлэн</option>
        </select>

        <div style={styles.notice}>
          Энэ нь gateway төлбөр биш, зөвхөн системд төлөлт бүртгэх үйлдэл.
        </div>

        {error && <div className="auth-error-message">{error}</div>}
        <button type="submit" style={styles.submit} disabled={submitting || totalRemaining <= 0}>
          {submitting ? "Бүртгэж байна..." : "Төлөлт бүртгэх"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: 760, margin: "0 auto", padding: "24px 16px", fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  backButton: { marginBottom: 18, padding: 0, border: 0, background: "transparent", color: "#2563eb", cursor: "pointer", fontSize: 14, fontWeight: 600, textAlign: "left" },
  card: { display: "flex", flexDirection: "column", padding: 24, borderRadius: 8, background: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 8px 30px rgba(15, 23, 42, 0.06)" },
  title: { margin: "0 0 6px", fontSize: 24, fontWeight: 600, color: "#0f172a" },
  subText: { margin: "0 0 20px", color: "#64748b", fontSize: 14 },
  balance: { display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 20, padding: 14, borderRadius: 8, background: "#eff6ff", color: "#1e3a8a", fontSize: 14 },
  label: { marginBottom: 8, color: "#334155", fontSize: 14, fontWeight: 600 },
  input: { width: "100%", height: 46, marginBottom: 16, padding: "0 12px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 15, fontFamily: "inherit" },
  notice: { marginBottom: 16, padding: 12, borderRadius: 8, background: "#f8fafc", color: "#475569", fontSize: 14 },
  submit: { width: "100%", padding: "13px 16px", border: 0, borderRadius: 8, background: "#2563eb", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "inherit" },
};
