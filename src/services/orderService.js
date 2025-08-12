import axios from "axios";
import { getAuthHeaders } from "./authService";

const API_URL = "http://localhost:5500/api/admin/orders";
// http://localhost:5500/api/auth

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
    // 1. Create a FormData object
    const formData = new FormData();

    // 2. Loop through the data object, appending fields to formData
    //    If data.customerSignature is a File, it will be appended properly.
    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
    });

    // 3. Add your auth headers, but let axios set the correct
    //    Content-Type for multipart/form-data automatically.
    const config = {
        ...getAuthHeaders(), // merges your existing auth headers
        headers: {
            ...getAuthHeaders().headers,
            "Content-Type": "multipart/form-data",
        },
    };

    // 4. Send formData instead of data
    const response = await axios.put(`${API_URL}/${orderId}`, formData, config);
    return response.data;
};
