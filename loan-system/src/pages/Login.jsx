import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";

export default function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async (event) => {
        event.preventDefault();
        if (!username || !password) {
            setError("Username болон password оруулна уу");
            return;
        }

        try {
            setError("");
            setLoading(true);
            const responseData = await loginUser(username.trim().toLowerCase(), password);

            if (responseData && responseData.data) {
                const { user } = responseData.data;
                onLogin(user);
                navigate("/dashboard", { replace: true });
            } else {
                setError("Нэвтрэх мэдээлэл дутуу ирлээ.");
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Нэвтрэхэд алдаа гарлаа"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
            <Card className="w-full max-w-sm p-6 sm:p-8">
                <div className="mb-6 text-center">
                    <h1 className="mt-2 text-2xl font-semibold tracking-tight">Нэвтрэх</h1>
                </div>
                <form className="space-y-4" onSubmit={handleLogin}>
                    {location.state?.registered && (
                        <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                            Бүртгэл үүслээ. {location.state.email || "И-мэйл"} хаягаар очсон холбоосоор нууц үгээ үүсгэнэ үү.
                        </div>
                    )}
                    {location.state?.passwordReset && (
                        <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">Нууц үг шинэчлэгдлээ. Шинэ нууц үгээрээ нэвтэрнэ үү.</div>
                    )}
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="login">Нэвтрэх нэр</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                            <Input
                            id="login"
                            placeholder="Утас, и-мэйл эсвэл нэвтрэх нэр"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="pl-9"
                            autoComplete="username"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="password">Нууц үг</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                            <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Нууц үг"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="px-9"
                            autoComplete="current-password"
                            />
                            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-950" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Нууц үг нуух" : "Нууц үг харуулах"}>
                                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
                            {error}
                        </div>
                    )}
                    <Button type="submit" disabled={loading}>
                        {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
                    </Button>
                    <p className="text-center text-sm text-slate-500">
                        <button type="button" className="font-medium text-black underline underline-offset-4" onClick={() => navigate("/forgot-password")}>Нууц үг мартсан</button>
                    </p>
                </form>
            </Card>
        </main>
    );
}
