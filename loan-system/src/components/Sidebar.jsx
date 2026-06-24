import { NavLink } from "react-router-dom";
import {
    HomeOutlined,
    UserOutlined,
    DollarOutlined,
    CreditCardOutlined,
    SettingOutlined,
} from "@ant-design/icons";
export default function Sidebar({ isOpen = false, onClose = () => {} }) {
    const menu = [
        { name: "Dashboard", path: "/dashboard", icon: <HomeOutlined /> },
        { name: "My Loan", path: "/loans", icon: <DollarOutlined /> },
        { name: "Payments", path: "/payments", icon: <CreditCardOutlined /> },
        { name: "Profile", path: "/profile", icon: <UserOutlined /> },
        { name: "Settings", path: "/settings", icon: <SettingOutlined /> },

    ];

    return (
        <div
            style={styles.sidebar}
            className={`app-sidebar ${isOpen ? "open" : ""}`}
        >
            <div style={styles.sidebarTop}>
                <div style={styles.logo}>Loan-System</div>

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
                        style={({ isActive }) => ({
                            ...styles.item,
                            background: isActive ? "#1d4ed8" : "transparent",
                            color: "#fff",
                            textDecoration: "none",
                        })}
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
        background: "#031644",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        padding: 20,
        boxSizing: "border-box",
    },

    sidebarTop: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 30,
    },

    logo: {
        fontSize: 20,
        fontWeight: "bold",
    },

    closeButton: {
        display: "none",
        border: "none",
        background: "transparent",
        color: "#fff",
        fontSize: "30px",
        lineHeight: 1,
        cursor: "pointer",
    },

    menu: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
    },

    item: {
        padding: "12px 14px",
        borderRadius: 8,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        transition: "0.2s",
        userSelect: "none",
    },
};
