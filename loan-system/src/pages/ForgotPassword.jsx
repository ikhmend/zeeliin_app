import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPasswordApi } from "../api/authApi";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      setLoading(true);
      const response = await forgotPasswordApi(email.trim().toLowerCase());
      setMessage(response.message || "Хэрэв бүртгэлтэй и-мэйл бол сэргээх холбоос илгээгдлээ.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Хүсэлт илгээхэд алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <Card className="w-full max-w-sm p-6 sm:p-8">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Нууц үг сэргээх</h1>
            <p className="mt-2 text-xs text-slate-500">Бүртгэлтэй и-мэйл хаягаа оруулна уу.</p>
          </div>
          <Input className="text-xs" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="И-мэйл" />
          {message && <div className="auth-success-message">{message}</div>}
          {error && <div className="auth-error-message">{error}</div>}
          <div className="flex flex-col gap-2">
            <Button type="submit" className="text-[11px]" disabled={loading}>
              {loading ? "Илгээж байна..." : "Сэргээх холбоос авах"}
            </Button>
            <Button type="button" className="text-[11px] border border-slate-200 bg-white text-black hover:bg-slate-50" onClick={() => navigate("/login")}>
              Нэвтрэх хэсэг рүү буцах
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
}
