// services/userService.js
import axios from "axios";
import { getAuthHeaders } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/api/admin`;
const USER_API_URL = `${API_BASE_URL}/api/user`;

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

// Get current user's profile
export const getUserProfile = async () => {
    try {
        const response = await axios.get(`${USER_API_URL}/profile`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Get user profile error:', error);
        throw error;
    }
};

// Update user profile
export const updateUserProfile = async (userData) => {
    try {
        const response = await axios.put(`${USER_API_URL}/profile`, userData, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Update user profile error:', error);
        throw error;
    }
};

// Upload profile picture (uses same endpoint as updateUserProfile but with FormData)
export const uploadProfilePicture = async (formData) => {
    try {
        const response = await axios.put(`${USER_API_URL}/profile`, formData, {
            ...getAuthHeaders(),
            headers: {
                ...getAuthHeaders().headers,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Upload profile picture error:', error);
        throw error;
    }
};

// Delete user account
export const deleteUserAccount = async (password, reason = '') => {
    try {
        const response = await axios.delete(`${USER_API_URL}/account`, {
            ...getAuthHeaders(),
            data: {
                password,
                reason
            }
        });
        return response.data;
    } catch (error) {
        console.error('Delete user account error:', error);
        throw error;
    }
};
