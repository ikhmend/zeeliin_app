import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function MainLayout({ onLogout }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const openSidebar = () => setIsSidebarOpen(true);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div style={styles.layout} className="app-layout">
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            {isSidebarOpen && (
                <button
                    type="button"
                    aria-label="Close menu overlay"
                    className="sidebar-overlay"
                    onClick={closeSidebar}
                />
            )}

            <div style={styles.content} className="app-content">
                <div style={styles.mobileHeader} className="mobile-header">
                    <button
                        type="button"
                        onClick={openSidebar}
                        style={styles.menuButton}
                        className="mobile-menu-button"
                        aria-label="Open menu"
                    >
                        ☰
                    </button>

                    <div style={styles.mobileLogo}>Loan-System</div>

                    <button
                        onClick={onLogout}
                        style={styles.mobileLogoutButton}
                    >
                        Logout
                    </button>
                </div>

                <div style={styles.topBar} className="desktop-topbar">
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

    mobileHeader: {
        display: "none",
    },

    menuButton: {
        width: "42px",
        height: "42px",
        borderRadius: "10px",
        border: "1px solid #e2e8f0",
        background: "#ffffff",
        color: "#0f172a",
        fontSize: "22px",
        cursor: "pointer",
    },

    mobileLogo: {
        fontSize: "17px",
        fontWeight: "700",
        color: "#0f172a",
    },

    mobileLogoutButton: {
        padding: "9px 13px",
        background: "#ffffff",
        color: "#ef4444",
        border: "1px solid #ff4d4f",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
    },
};
