import { Layout, Menu } from "antd";
import {
    DashboardOutlined,
    UserOutlined,
    DollarOutlined,
    CreditCardOutlined,
    BarChartOutlined,
    SettingOutlined,
    } from "@ant-design/icons";
    import { useNavigate, useLocation } from "react-router-dom";

    const { Sider } = Layout;

    export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Sider width={220}>
        <div style={{ color: "white", padding: 16, fontWeight: "bold" }}>
            BBSB SYSTEM
        </div>

        <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            onClick={(e) => navigate(e.key)}
            items={[
            { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
            { key: "/customers", icon: <UserOutlined />, label: "Customers" },
            { key: "/loans", icon: <DollarOutlined />, label: "Loans" },
            { key: "/payments", icon: <CreditCardOutlined />, label: "Payments" },
            { key: "/reports", icon: <BarChartOutlined />, label: "Reports" },
            { key: "/settings", icon: <SettingOutlined />, label: "Settings" },
            ]}
        />
        </Sider>
    );
}