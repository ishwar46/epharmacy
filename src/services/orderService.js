import axios from "axios";
import { getAuthHeaders } from "./authService";

const API_URL = "https://epharmacy-api.onrender.com/api/admin/orders";

export const getOrders = async () => {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
};
