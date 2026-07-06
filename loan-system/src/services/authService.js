import api from "../api/api";
import { refreshAccessToken, setAccessToken } from "../api/api";
export async function loginUser(username, password) {
    const res = await api.post("/auth/login", { 
        login: username, 
        password: password 
    });
    setAccessToken(res.data?.data?.token);
    return res.data;
}

// register
export async function registerUser(registerData) {
    const res = await api.post("/auth/register", registerData);
    return res.data;
}
//uuriin medeelel
export async function getMyProfile() {
    const res = await api.get("/auth/personal");
    return res.data;
}

export async function bootstrapSession() {
    await refreshAccessToken();
    const response = await getMyProfile();
    return response.data;
}
