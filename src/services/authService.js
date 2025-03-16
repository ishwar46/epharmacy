// src/services/authService.js
import axios from "axios";

const API_URL = "https://epharmacy-api.onrender.com/api/auth"; // Adjust as needed

// Logs the user in by making a POST request to /login
export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data; // { success, message, data: { token, role, etc. } }
};

// Retrieves the logged-in user's info from /me
export const getMe = async () => {
    const response = await axios.get(`${API_URL}/me`, getAuthHeaders());
    return response.data; // { success, data: { _id, name, email, role, ... } }
};

// Utility for attaching the JWT from localStorage
export const getAuthHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});
