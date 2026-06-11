import { Layout, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

export default function HeaderBar() {
    const navigate = useNavigate();
    // 2. Системээс гарах функц
    const logout = () => {
        localStorage.removeItem("token");     // Санах ойноос token-ийг устгана
        localStorage.removeItem("username");  // Нэрийг нь бас устгана
        navigate("/");                         // Нэвтрэх хуудас руу шилжүүлнэ
    };

    return (
        <Header
        style={{
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center", // Элементүүдийг босоо чиглэлд яг голлуулна
            padding: "0 16px",
        }}
        >
        {/* Зүүн талд системийн нэр харагдана */}
        <div style={{ fontWeight: "bold", fontSize: "16px" }}>
            Admin panel
        </div>

        {/* Баруун талд Хэрэглэгчийн нэр болон Гарах товчлуур зэрэгцэж харагдана */}
        <Space size="middle">
            
            <Button danger onClick={logout}>
            Logout
            </Button>
        </Space>
        </Header>
    );
}