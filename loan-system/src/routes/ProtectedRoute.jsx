import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ authStatus }) {
    if (authStatus === "loading") {
        return <div className="auth-loading">Session шалгаж байна...</div>;
    }
    if (authStatus !== "authenticated") {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
