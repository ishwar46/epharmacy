import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/api/auth`;

// Create axios instance with interceptors
const authAPI = axios.create({
    baseURL: API_URL,
});

// Request interceptor to add token to all requests
authAPI.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 errors
authAPI.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear invalid token
            localStorage.removeItem("token");
            localStorage.removeItem("userRole");
            // Redirect to login if not already there
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Logs the user in by making a POST request to /login
export const login = async (email, password) => {
    try {
        const response = await authAPI.post('/login', { email, password });

        // Store token and user data
        if (response.data.success && response.data.token) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userRole", response.data.data.role);
            localStorage.setItem("userId", response.data.data._id);
        }

        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

// Retrieves the logged-in user's info from /me
export const getMe = async () => {
    try {
        const response = await authAPI.get('/me');
        return response.data;
    } catch (error) {
        console.error('GetMe error:', error);
        throw error;
    }
};

// Register new user
export const register = async (userData) => {
    try {
        const response = await authAPI.post('/register', userData);

        if (response.data.success && response.data.token) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userRole", response.data.data.role);
            localStorage.setItem("userId", response.data.data._id);
        }

        return response.data;
    } catch (error) {
        console.error('Register error:', error);
        throw error;
    }
};

// Logout user
export const logout = async () => {
    try {
        await authAPI.post('/logout');
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Always clear local storage
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
    }
};

// Update user details
export const updateDetails = async (userData) => {
    try {
        const response = await authAPI.put('/updatedetails', userData);
        return response.data;
    } catch (error) {
        console.error('Update details error:', error);
        throw error;
    }
};

// Update password
export const updatePassword = async (passwords) => {
    try {
        const response = await authAPI.put('/updatepassword', passwords);
        return response.data;
    } catch (error) {
        console.error('Update password error:', error);
        throw error;
    }
};

// Utility functions
export const getToken = () => localStorage.getItem("token");
export const getUserRole = () => localStorage.getItem("userRole");
export const getUserId = () => localStorage.getItem("userId");
export const isAuthenticated = () => !!getToken();

// Legacy function for backward compatibility
export const getAuthHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});