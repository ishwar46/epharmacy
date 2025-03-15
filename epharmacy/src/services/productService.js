import axios from "axios";
import { getAuthHeaders } from "./authService";

const API_URL = "http://localhost:5500/api/products";

export const getProducts = async () => {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
};
