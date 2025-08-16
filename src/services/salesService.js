// src/services/salesService.js
import axios from "axios";
import { getAuthHeaders } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5500';
const API_URL = `${API_BASE_URL}/api/admin/sales`;

export const getSalesTotal = async () => {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
};
