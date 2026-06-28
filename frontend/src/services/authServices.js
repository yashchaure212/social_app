import api from "../lib/axios";

export const signupUser = async (data) => {
    return api.post("/auth/register", data);
};

export const loginUser = async (data) => {
    return api.post("/auth/login", data);
};

export const logoutUser = async () => {
    return api.get("/auth/logout");
};

export const getMe = async () => {
    return api.get("/auth/me");
};

export const EditProfile = async (data) => {
    return api.put("/auth/me", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};