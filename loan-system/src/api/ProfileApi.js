import api from "./api";

export async function getMyProfile() {
    const res = await api.get(`/me/profile?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
        },
    });

    return res.data.data || null;
}

export async function updateMyProfile(profileData) {
    const res = await api.put(`/me/profile?t=${Date.now()}`, profileData, {
        headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
        },
    });

    return res.data.data || res.data;
}
