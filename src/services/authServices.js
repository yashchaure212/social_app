import axios from "axios"

export const signUpUser = async (data) => {
    return await axios.post(
        "http://localhost:5000/api/auth/register",
        data,
        { withCredentials: true })
};

export const loginUser = async (data) => {
    return await axios.post(
        "http://localhost:5000/api/auth/login",
        data,
        { withCredentials: true }
    )
};

export const logoutUser = async () => {
    return await axios.get(
        "http://localhost:5000/api/auth/logout",
        { withCredentials: true }
    )
};