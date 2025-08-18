import axios from "axios";
import { getAuthHeaders } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5500';
const ADMIN_API_URL = `${API_BASE_URL}/api/admin/orders`;
const CUSTOMER_API_URL = `${API_BASE_URL}/api/orders`;

// Create axios instance for customer orders
const customerOrderAPI = axios.create({
    baseURL: CUSTOMER_API_URL,
});

// Request interceptor to add token and guest ID to customer order requests
customerOrderAPI.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add guest ID header if no token (for guest orders)
        if (!token) {
            const guestId = localStorage.getItem("guestId");
            if (guestId) {
                config.headers['x-guest-id'] = guestId;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ==========================================
// CUSTOMER ORDER FUNCTIONS
// ==========================================

// Create order from cart
export const createOrder = async (orderData) => {
    try {
        const response = await customerOrderAPI.post('/', orderData);
        return response.data;
    } catch (error) {
        console.error('Create order error:', error);
        throw error;
    }
};

// Get user's orders
export const getUserOrders = async () => {
    try {
        const response = await customerOrderAPI.get('/');
        return response.data;
    } catch (error) {
        console.error('Get user orders error:', error);
        throw error;
    }
};

// Get single order by ID
export const getOrderById = async (orderId) => {
    try {
        const response = await customerOrderAPI.get(`/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Get order error:', error);
        throw error;
    }
};

// Cancel order
export const cancelOrder = async (orderId, reason) => {
    try {
        const response = await customerOrderAPI.put(`/${orderId}/cancel`, { reason });
        return response.data;
    } catch (error) {
        console.error('Cancel order error:', error);
        throw error;
    }
};

// Track order by order number (public)
export const trackOrder = async (orderNumber, phone = null) => {
    try {
        const url = phone 
            ? `${CUSTOMER_API_URL}/track/${orderNumber}?phone=${encodeURIComponent(phone)}`
            : `${CUSTOMER_API_URL}/track/${orderNumber}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Track order error:', error);
        throw error;
    }
};

// ==========================================
// ADMIN ORDER FUNCTIONS (existing)
// ==========================================

// Fetch all orders (Admin View)
export const getOrders = async () => {
    const response = await axios.get(ADMIN_API_URL, getAuthHeaders());
    return response.data;
};

// Fetch a single order by ID (Admin View)
export const getOrder = async (orderId) => {
    const response = await axios.get(`${ADMIN_API_URL}/${orderId}`, getAuthHeaders());
    return response.data;
};

// Update an order (Admin View)
export const updateOrder = async (orderId, data) => {
    // Check if we have file uploads (customerSignature)
    const hasFileUpload = data.customerSignature instanceof File;
    
    if (hasFileUpload) {
        // Use FormData for file uploads
        const formData = new FormData();

        // Handle complex objects properly
        Object.entries(data).forEach(([key, value]) => {
            if (typeof value === 'object' && !(value instanceof File)) {
                // Convert complex objects to JSON strings
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value);
            }
        });

        // Use FormData config
        const config = {
            ...getAuthHeaders(),
            headers: {
                ...getAuthHeaders().headers,
                "Content-Type": "multipart/form-data",
            },
        };

        const response = await axios.put(`${ADMIN_API_URL}/${orderId}`, formData, config);
        return response.data;
    } else {
        // Use regular JSON for non-file requests (like prescription verification)
        const response = await axios.put(`${ADMIN_API_URL}/${orderId}`, data, getAuthHeaders());
        return response.data;
    }
};

export default {
    // Customer functions
    createOrder,
    getUserOrders,
    getOrderById,
    cancelOrder,
    trackOrder,
    
    // Admin functions
    getOrders,
    getOrder,
    updateOrder
};
