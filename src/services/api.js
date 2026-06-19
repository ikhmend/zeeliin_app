import axios from "axios";

const api = axios.create({
    baseURL: "http://10.0.100.172:5000/api",
    });

    api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
        };
    }

    return config;
    });

    api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API ERROR:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;