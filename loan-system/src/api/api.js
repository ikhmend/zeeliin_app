import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";
let accessToken = null;
let refreshPromise = null;
let unauthorizedHandler = null;

export function setAccessToken(token) {
    accessToken = token || null;
}

export function clearAccessToken() {
    accessToken = null;
}

export function setUnauthorizedHandler(handler) {
    unauthorizedHandler = handler;
}

const api = axios.create({ baseURL: BASE_URL, withCredentials: true });
const refreshClient = axios.create({ baseURL: BASE_URL, withCredentials: true });

export async function refreshAccessToken() {
    if (!refreshPromise) {
        refreshPromise = refreshClient.post("/auth/refresh", {})
            .then((response) => {
                const token = response.data?.data?.token;
                if (!token) throw new Error("Шинэ access token ирсэнгүй.");
                setAccessToken(token);
                return token;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
}

api.interceptors.request.use((config) => {
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const url = originalRequest?.url || "";
        const isAuthRequest = [
            "/auth/login",
            "/auth/register",
            "/auth/refresh",
            "/auth/logout",
            "/auth/forgot-password",
            "/auth/reset-password",
        ].some((path) => url.includes(path));

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthRequest) {
            originalRequest._retry = true;
            try {
                const token = await refreshAccessToken();
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            } catch (refreshError) {
                clearAccessToken();
                unauthorizedHandler?.();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    },
);

export default api;
