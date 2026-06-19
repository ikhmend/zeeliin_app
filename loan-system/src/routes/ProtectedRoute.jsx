import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    const token = localStorage.getItem("token");

    // Бэкэндийн замтай андуурсан байсныг фронтендын зөв зам буюу "/login" болгож заслаа
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}