import axios from "axios";
import { getAuthHeaders } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/api/products`;

// Fetch all products
export const getProducts = async () => {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
};

// Fetch single product
export const getProduct = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
};

// Create product (with images)
export const createProduct = async (productData) => {
    const formData = new FormData();

    // Append text fields
    formData.append("sku", productData.sku);
    formData.append("name", productData.name);
    formData.append("brand", productData.brand);
    formData.append("description", productData.description);
    formData.append("dosage", productData.dosage);
    formData.append("price", productData.price);
    formData.append("stock", productData.stock);
    formData.append("category", productData.category);
    formData.append("medicineType", productData.medicineType);

    // Append images (if any)
    if (productData.images && productData.images.length) {
        for (const file of productData.images) {
            formData.append("images", file); // 'images' matches upload.array('images', 5)
        }
    }

    // Configure headers
    const config = {
        ...getAuthHeaders(),
        headers: {
            ...getAuthHeaders().headers,
            "Content-Type": "multipart/form-data",
        },
    };

    const response = await axios.post(API_URL, formData, config);
    return response.data;
};

// Update product (with optional new images)
export const updateProduct = async (productId, productData) => {
    const formData = new FormData();

    // Append text fields
    formData.append("sku", productData.sku);
    formData.append("name", productData.name);
    formData.append("brand", productData.brand);
    formData.append("description", productData.description);
    formData.append("dosage", productData.dosage);
    formData.append("price", productData.price);
    formData.append("stock", productData.stock);
    formData.append("category", productData.category);
    formData.append("medicineType", productData.medicineType);

    // Append new images (if any)
    if (productData.images && productData.images.length) {
        for (const file of productData.images) {
            formData.append("images", file);
        }
    }

    const config = {
        ...getAuthHeaders(),
        headers: {
            ...getAuthHeaders().headers,
            "Content-Type": "multipart/form-data",
        },
    };

    const response = await axios.put(`${API_URL}/${productId}`, formData, config);
    return response.data;
};

// Delete product
export const deleteProduct = async (productId) => {
    const response = await axios.delete(`${API_URL}/${productId}`, getAuthHeaders());
    return response.data;
};
