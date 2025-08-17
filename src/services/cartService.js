import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/api/cart`;

// Create axios instance with interceptors
const cartAPI = axios.create({
    baseURL: API_URL,
});

// Request interceptor to add token and guest ID to all requests
cartAPI.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add guest ID header if no token (for guest users)
        if (!token) {
            const guestId = localStorage.getItem("guestId");
            if (guestId) {
                config.headers['x-guest-id'] = guestId;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
cartAPI.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear invalid token
            localStorage.removeItem("token");
            localStorage.removeItem("userRole");
            localStorage.removeItem("userId");
        }
        return Promise.reject(error);
    }
);

// Get user's cart
export const getCart = async (guestId = null) => {
    try {
        const config = {};

        // Add guest ID as query param if provided and no token
        const token = localStorage.getItem("token");
        if (!token && guestId) {
            config.params = { guestId };
        }

        const response = await cartAPI.get('/', config);
        return response.data;
    } catch (error) {
        console.error('Get cart error:', error);
        throw error;
    }
};

// Add item to cart
export const addToCart = async ({ productId, quantity, purchaseType = 'package', guestId = null }) => {
    try {
        const data = { productId, quantity, purchaseType };

        // Add guest ID to body if no token
        const token = localStorage.getItem("token");
        if (!token && guestId) {
            data.guestId = guestId;
        }

        const response = await cartAPI.post('/add', data);
        return response.data;
    } catch (error) {
        console.error('Add to cart error:', error);
        throw error;
    }
};

// Update cart item quantity
export const updateCartItem = async ({ productId, purchaseType, quantity, guestId = null }) => {
    try {
        const data = { productId, purchaseType, quantity };

        // Add guest ID to body if no token
        const token = localStorage.getItem("token");
        if (!token && guestId) {
            data.guestId = guestId;
        }

        const response = await cartAPI.put('/update', data);
        return response.data;
    } catch (error) {
        console.error('Update cart item error:', error);
        throw error;
    }
};

// Remove item from cart
export const removeFromCart = async ({ productId, purchaseType, guestId = null }) => {
    try {
        const data = { productId, purchaseType };

        // Add guest ID to body if no token
        const token = localStorage.getItem("token");
        if (!token && guestId) {
            data.guestId = guestId;
        }

        const response = await cartAPI.delete('/remove', { data });
        return response.data;
    } catch (error) {
        console.error('Remove from cart error:', error);
        throw error;
    }
};

// Clear entire cart
export const clearCart = async (guestId = null) => {
    try {
        const data = {};

        // Add guest ID to body if no token
        const token = localStorage.getItem("token");
        if (!token && guestId) {
            data.guestId = guestId;
        }

        const response = await cartAPI.delete('/clear', { data });
        return response.data;
    } catch (error) {
        console.error('Clear cart error:', error);
        throw error;
    }
};

// Check product availability
export const checkAvailability = async ({ productId, quantity, purchaseType = 'package' }) => {
    try {
        const response = await cartAPI.post('/check-availability', {
            productId,
            quantity,
            purchaseType
        });
        return response.data;
    } catch (error) {
        console.error('Check availability error:', error);
        throw error;
    }
};

export default {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    checkAvailability
};