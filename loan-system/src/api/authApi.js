import api from "./api";
import { clearAccessToken } from "./api";

export const logoutApi = async () => {
    try {
        const res = await api.post("/auth/logout");
        return res.data;
    } finally {
        clearAccessToken();
    }
};

export const changePasswordApi = async (data) => {
    const res = await api.patch("/auth/password", data);
    return res.data;
};

export const forgotPasswordApi = async (email) => {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
};

export const resetPasswordApi = async (data) => {
    const res = await api.post("/auth/reset-password", data);
    return res.data;
};
