export const getUser = () => {
    try {
        const data = localStorage.getItem("user");
        return data ? JSON.parse(data) : null;
    } catch (error) {
        return null;
    }
}

export const setUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
};

export const removeUser = () => {
    localStorage.removeItem("user");
};

export const setToken = (token) => {
    localStorage.setItem("token", token);
};

export const getToken = () => {
    return localStorage.getItem("token");
};

export const removeToken = () => {
    localStorage.removeItem("token");
};