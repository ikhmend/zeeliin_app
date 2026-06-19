const styles = {
    wrapper: {
        display: "flex",
        height: "100vh",
        width: "100%",
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        margin: 0,
        backgroundColor: "#ffffff",
    },


    left: {
        flex: 1.2,
        
        backgroundImage: `
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1200 800'%3E%3Cpath d='M0,380 Q300,180 600,380 T1200,380 L1200,800 L0,800 Z' fill='rgba(79,70,229,0.05)'/%3E%3Cpath d='M0,430 Q350,280 700,480 T1200,330 L1200,800 L0,800 Z' fill='rgba(109,40,217,0.04)'/%3E%3C/svg%3E"), 
            radial-gradient(circle at top left, #dbe2ff 0%, #f3f0ff 50%, #ffffff 100%)
        `,
        backgroundSize: "cover",
        padding: "80px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
    },

    tagRow: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "24px",
    },

    tag: {
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.05em",
        color: "#4f46e5", 
    },

    title: {
        fontSize: "44px",
        fontWeight: "700",
        color: "#1e1b4b", 
        lineHeight: "1.25",
        margin: "0 0 20px 0",
        letterSpacing: "-0.02em",
    },

    desc: {
        color: "#4f5e7b",
        fontSize: "16px",
        lineHeight: "1.6",
        maxWidth: "460px",
        margin: 0,
    },

    /* RIGHT SIDE */
    right: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        padding: "40px",
    },

    card: {
        width: "100%",
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
    },

    logoRow: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "16px",
        fontSize: "18px",
        fontWeight: "bold",
        color: "#0f172a",
    },

    logoIcon: {
        fontWeight: "800",
        background: "linear-gradient(135deg, #ff7675, #3b49df)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    },

    formTitle: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#0f172a",
        margin: "0 0 32px 0",
    },

    input: {
        width: "100%",
        padding: "16px",
        fontSize: "15px",
        borderRadius: "10px",
        border: "1px solid #e2e8f0",
        backgroundColor: "#ffffff",
        marginBottom: "20px",
        boxSizing: "border-box",
        outline: "none",
        color: "#334155",
        transition: "border-color 0.2s ease",
    },

    row: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "14px",
        marginBottom: "32px",
        color: "#475569",
    },

    checkboxLabel: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
    },

    checkbox: {
        width: "18px",
        height: "18px",
        borderRadius: "4px",
        border: "1px solid #cbd5e1",
        cursor: "pointer",
    },

    forgotLink: {
        color: "#3b49df",
        textDecoration: "none",
        fontWeight: "500",
    },

    button: {
        width: "100%",
        padding: "16px",
        background: "#3b49df", // Тэрхүү тод, амьд royal цэнхэр товчлуур
        color: "white",
        border: "none",
        borderRadius: "10px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "background 0.2s ease, transform 0.1s ease",
        marginBottom: "24px",
    },

    footer: {
        fontSize: "14px",
        textAlign: "center",
        color: "#475569",
        margin: 0,
    },

    footerLink: {
        color: "#3b49df",
        fontWeight: "600",
        textDecoration: "none",
        marginLeft: "8px",
        cursor: "pointer",
    },
      inputWrapper: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        marginBottom: "16px",
        border: "1px solid #cbd5e1",
        borderRadius: "8px", 
        backgroundColor: "#fff",
    },
    inputIcon: {
        position: "absolute",
        left: "12px",
        color: "#64748b",
        fontSize: "18px",
        zIndex: 2,
    },
    cleanInput: {
        width: "100%",
        paddingLeft: "40px", 
        paddingRight: "40px", 
        border: "none", 
        margin: 0,
        borderRadius: "8px",
        backgroundColor: "transparent",
    },
    eyeIcon: {
        position: "absolute",
        right: "12px",
        color: "#94a3b8",
        cursor: "pointer",
        fontSize: "18px",
        display: "flex",
        alignItems: "center",
        zIndex: 2,
    },
    blueButton: {
        backgroundColor: "#1677ff", 
        borderRadius: "8px", 
        color: "#fff",
        fontWeight: "500",
        border: "none",
        cursor: "pointer",
    }
    
};

export default styles;