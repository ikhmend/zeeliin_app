import axios from "axios";

const api = axios.create({
    // Бэкэнд ажиллаж буй IP хаяг
    baseURL: "http://10.0.100.172:5000/api", 
    // Күүкигээр мэдээлэл солилцохыг зөвшөөрөх (ERR_FAILED алдааг засна)
    withCredentials: true, 
});

// Хүсэлт илгээх бүрд токен шалгаж Header-т нэмэх
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