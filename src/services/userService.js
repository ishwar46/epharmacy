// services/userService.js
import axios from "axios";
import { getAuthHeaders } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/api/admin`;

// Fetch all users
export const getUsers = async () => {
    const response = await axios.get(`${API_URL}/users`, getAuthHeaders());
    return response.data;
};

// Fetch single user (if you want to get details by ID)
export const getUser = async (userId) => {
    const response = await axios.get(`${API_URL}/users/${userId}`, getAuthHeaders());
    return response.data;
};

// Create user
export const createUser = async (userData) => {
    // userData = { name, email, password, role, phone, address... }
    const response = await axios.post(`${API_URL}/users`, userData, getAuthHeaders());
    return response.data;
};

// Update user
export const updateUser = async (userId, userData) => {
    // userData can have name, email, password, role, phone, address
    const response = await axios.put(`${API_URL}/users/${userId}`, userData, getAuthHeaders());
    return response.data;
};

// Delete user
export const deleteUser = async (userId) => {
    const response = await axios.delete(`${API_URL}/users/${userId}`, getAuthHeaders());
    return response.data;
};
