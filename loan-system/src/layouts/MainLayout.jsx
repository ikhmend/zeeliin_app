import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MainLayout({ user, onLogout }) {
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
                <Header user={user} onMenuClick={openSidebar} onLogout={onLogout} />
                <main style={styles.pageContent}>
                    <Outlet />
                </main>
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
        padding: 0,
        background: "#f8fafc",
        overflowY: "auto",
        boxSizing: "border-box",
        position: "relative",
    },

    pageContent: {
        padding: "24px 32px",
    },
};
