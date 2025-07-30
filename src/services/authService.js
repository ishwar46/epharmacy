import axios from "axios";

const API_URL = "http://localhost:5500/api/auth";

// Logs the user in by making a POST request to /login
export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
};

// Retrieves the logged-in user's info from /me
export const getMe = async () => {
    const response = await axios.get(`${API_URL}/me`, getAuthHeaders());
    return response.data;
};

// Utility for attaching the JWT from localStorage
export const getAuthHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});
