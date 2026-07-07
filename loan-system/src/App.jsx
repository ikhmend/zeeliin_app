import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, replace } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import Loans from "./pages/Loans";
import LoanDetail from "./pages/LoanDetail";
import MakePayment from "./pages/MakePayment";
import Payments from "./pages/Payments";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { logoutApi } from "./api/authApi";
import { clearAccessToken, setUnauthorizedHandler } from "./api/api";
import { bootstrapSession } from "./services/authService";

export default function App() {
  const [authStatus, setAuthStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUnauthorizedHandler(() => {
      if (active) setAuthStatus("guest");
    });
    bootstrapSession()
      .then(() => active && setAuthStatus("authenticated"))
      .catch(() => {
        clearAccessToken();
        if (active) setAuthStatus("guest");
      });
    return () => {
      active = false;
      setUnauthorizedHandler(null);
    };
  }, []);

  const handleLogin = () => setAuthStatus("authenticated");

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // Logout still clears local session if the server session is already gone.
    } finally {
      clearAccessToken();
      setAuthStatus("guest");
    }
  };

  const authenticated = authStatus === "authenticated";
  const guestOnly = (element) => {
    if (authStatus === "loading") return <div className="auth-loading">Session шалгаж байна...</div>;
    return authenticated ? <Navigate to="/dashboard" replace /> : element;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={authStatus==="loading"? (<div className="auth-loading">Session шалгаж байна...</div>): authenticated? (<Navigate to= "/dashboard" replace/>) : (<Navigate to="/login" replace/>)}/>
        <Route path="/login" element={guestOnly(<Login onLogin={handleLogin} />)} />
        <Route path="/register" element={guestOnly(<Register />)} />
        <Route path="/forgot-password" element={guestOnly(<ForgotPassword />)} />
        <Route path="/reset-password" element={guestOnly(<ResetPassword />)} />

        <Route element={<ProtectedRoute authStatus={authStatus} />}>
          <Route element={<MainLayout onLogout={handleLogout} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/loans/:loanId" element={<LoanDetail />} />
            <Route path="/loans/:loanId/pay" element={<MakePayment />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings onLogout={handleLogout} />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to={authenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
