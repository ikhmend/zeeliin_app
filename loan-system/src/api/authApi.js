import api from "./api";

export const logoutApi = async () => {
    const res = await api.post("/auth/logout");
    return res.data;
};

export const changePasswordApi = async (data) => {
    const res = await api.patch("/auth/password", data);
    return res.data;
};