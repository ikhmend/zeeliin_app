import { Layout, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const { Header } = Layout;

    export default function HeaderBar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <Header style={{
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 16px",
        }}>
        <div style={{ fontWeight: "bold" }}>
            Admin Panel
        </div>

        <Space>
            <span>{user?.username}</span>
            <Button danger onClick={handleLogout}>
            Logout
            </Button>
        </Space>
        </Header>
    );
}