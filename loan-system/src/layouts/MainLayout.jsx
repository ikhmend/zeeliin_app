import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function MainLayout({ onLogout }) {
    return (
        <div style={styles.layout}>
        <Sidebar />

        <div style={styles.content}>
            <div style={styles.topBar}>
            <button onClick={onLogout} style={styles.logoutButton}>
                Logout
            </button>
            </div>

            <Outlet />
        </div>
        </div>
    );
    }

    const styles = {
    layout: {
        display: "flex",
        height: "100vh",
        width: "100vw",
    },

    content: {
        flex: 1,
        padding: "24px 32px",
        background: "#f8fafc",
        overflowY: "auto",
        boxSizing: "border-box",
        position: "relative",
    },

    topBar: {
        position: "absolute",
        top: 24,
        right: 32,
        zIndex: 10,
    },

    logoutButton: {
        padding: "10px 22px",
        background: "#ffffff",
        color: "#ef4444",
        border: "1px solid #ff4d4f",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: "500",
    },
};