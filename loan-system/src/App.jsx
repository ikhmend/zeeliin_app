import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import Loans from "./pages/Loans";
import LoanDetail from "./pages/LoanDetail";
import Payments from "./pages/Payments";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Register from "./pages/Register";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Үндсэн хуудас руу орвол шууд login руу үсрэнэ */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Нэвтрэх хуудас */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        {/* БҮРТГҮҮЛЭХ ХУУДАС (Энд хамгаалалтаас гаргаж тавьлаа) */}
        <Route
          path="/register"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Register />
            )
          }
        />

        {/* Зөвхөн нэвтэрсэн хэрэглэгч үзэх хэсэг */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout onLogout={handleLogout} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/loans/:loanId" element={<LoanDetail />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
        
        {/* Буруу зам уулзвал login руу буцаах (Заавал биш ч байхад зүгээр) */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}