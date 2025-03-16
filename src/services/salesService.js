// src/services/salesService.js
import axios from "axios";
import { getAuthHeaders } from "./authService";

const API_URL = "http://localhost:5500/api/admin/sales";

export const getSalesTotal = async () => {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
};
