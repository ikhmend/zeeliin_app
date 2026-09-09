import { NavLink } from "react-router-dom";
import { CircleDollarSign, CreditCard, House, Settings, User } from "lucide-react";
export default function Sidebar({ isOpen = false, onClose = () => {} }) {
    const menu = [
        { name: "Dashboard", path: "/dashboard", icon: <House className="size-4" /> },
        { name: "My Loan", path: "/loans", icon: <CircleDollarSign className="size-4" /> },
        { name: "Payments", path: "/payments", icon: <CreditCard className="size-4" /> },
        { name: "Profile", path: "/profile", icon: <User className="size-4" /> },
        { name: "Settings", path: "/settings", icon: <Settings className="size-4" /> },

    ];

    return (
        <div
            style={styles.sidebar}
            className={`app-sidebar ${isOpen ? "open" : ""}`}
        >
            <div style={styles.sidebarTop}>
                <div style={styles.logo}>Loan-App</div>

                <button
                    type="button"
                    onClick={onClose}
                    style={styles.closeButton}
                    className="sidebar-close"
                    aria-label="Close menu"
                >
                    ×
                </button>
            </div>

            <div style={styles.menu}>
                {menu.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={onClose}
                        style={() => ({
                            ...styles.item,
                            color: "#111827",
                            textDecoration: "none",
                        })}
                        className={({ isActive }) => `text-xs transition-colors hover:bg-slate-100 ${isActive ? "bg-slate-100" : ""}`}
                    >
                        <span style={{ marginRight: 10 }}>{item.icon}</span>
                        {item.name}
                    </NavLink>
                ))}
            </div>
        </div>
    );
}

const styles = {
    sidebar: {
        width: 240,
        height: "100vh",
        background: "#fff",
        color: "#111827",
        display: "flex",
        flexDirection: "column",
        padding: "16px 20px",
        borderRight: "1px solid #e5e7eb",
        boxSizing: "border-box",
    },

    sidebarTop: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 24,
    },

    logo: {
        fontSize: 28,
        fontWeight: "bold",
        letterSpacing: "-1.5px",
    },

    closeButton: {
        display: "none",
        border: "none",
        background: "transparent",
        color: "#111827",
        fontSize: "30px",
        lineHeight: 1,
        cursor: "pointer",
    },

    menu: {
        display: "flex",
        flexDirection: "column",
        gap: 2,
    },

    item: {
        padding: "9px 0",
        borderRadius: 8,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        transition: "0.2s",
        userSelect: "none",
    },
};
