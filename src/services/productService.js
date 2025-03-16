// src/services/productService.js
import axios from "axios";
import { getAuthHeaders } from "./authService";

const API_URL = "http://localhost:5500/api/products";

export const getProducts = async () => {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
};

export const getProduct = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
};

export const createProduct = async (productData) => {
    const response = await axios.post(API_URL, productData, getAuthHeaders());
    return response.data;
};

export const updateProduct = async (id, productData) => {
    const response = await axios.put(`${API_URL}/${id}`, productData, getAuthHeaders());
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
};
