import axios from "axios";
import { getAuthHeaders } from "./authService";

const API_URL = "http://localhost:5500/api/admin/orders";

// Fetch all orders (Admin View)
export const getOrders = async () => {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
};

// Fetch a single order by ID (Admin View)
export const getOrder = async (orderId) => {
    const response = await axios.get(`${API_URL}/${orderId}`, getAuthHeaders());
    return response.data;
};

// Update an order (Admin View)
export const updateOrder = async (orderId, data) => {
    const response = await axios.put(`${API_URL}/${orderId}`, data, getAuthHeaders());
    return response.data;
};
