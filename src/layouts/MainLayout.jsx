import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import HeaderBar from "../components/HeaderBar";

const { Content } = Layout;

export default function MainLayout() {
return (
<Layout style={{ minHeight: "100vh" }}>
    <Sidebar />

    <Layout>
    <HeaderBar />

    <Content style={{ margin: 16, padding: 16, background: "#f5f5f5" }}>
        <Outlet />
    </Content>
    </Layout>
</Layout>
);
}