import axios from "axios";

const api = axios.create({
    baseURL: "http://143.198.215.216:5000/api", 
    // cookie accept
    withCredentials: true, 
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

export default api;