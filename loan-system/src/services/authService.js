import api from "../api/api";

// 1. Нэвтрэх (Login)
export async function loginUser(username, password) {
    // Мэдээллийг бэкэндийн нэхэж буй "login" гэдэг нэрээр багцалж илгээнэ!
    const res = await api.post("/auth/login", { 
        login: username, // <--- ЭНЭ ХЭСЭГ ХАМГИЙН ЧУХАЛ!
        password: password 
    });
    return res.data; 
}

// 2. Бүртгүүлэх (Register)
export async function registerUser(registerData) {
    const res = await api.post("/auth/register", registerData);
    return res.data;
}

// 3. Өөрийн мэдээлэл татах (Profile)
export async function getMyProfile() {
    const res = await api.get("/auth/personal");
    return res.data;
}