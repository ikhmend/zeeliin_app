import axios from "axios";

const BASE_URL = "http://143.198.215.216:5000/api";

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    });

    api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        };
        }

        return config;
    },
    (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (!originalRequest) {
        return Promise.reject(error);
        }

        const isAuthRequest =
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/register") ||
        originalRequest.url?.includes("/auth/refresh") ||
        originalRequest.url?.includes("/auth/logout");

        if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !isAuthRequest
        ) {
        originalRequest._retry = true;

        try {
            const refreshRes = await axios.post(
            `${BASE_URL}/auth/refresh`,
            {},
            {
                withCredentials: true,
            }
            );

            const newToken = refreshRes.data?.data?.token;

            if (!newToken) {
            throw new Error("Шинэ access token ирсэнгүй.");
            }

            localStorage.setItem("token", newToken);

            originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newToken}`,
            };

            return api(originalRequest);
        } catch (refreshError) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "/login";

            return Promise.reject(refreshError);
        }
        }

        return Promise.reject(error);
    }
);

export default api;