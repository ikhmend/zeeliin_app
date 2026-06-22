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
import {logoutApi} from "./api/authApi";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {

    try {
      await logoutApi();

    } catch (error) {

      console.error("Logout failed:", error);
    } finally {

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

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

        {/* nevtersen herglegchid*/}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout onLogout={handleLogout} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/loans/:loanId" element={<LoanDetail />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings onLogout={handleLogout} />} />
            
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}