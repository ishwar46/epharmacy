const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5500';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};

const getAuthHeadersMultipart = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
    };
};

// Get all products with filters
export const getProducts = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams();

        Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
                queryParams.append(key, filters[key]);
            }
        });

        const queryString = queryParams.toString();
        const url = `${API_BASE_URL}/api/products${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};


// getCategories
export const getCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products/categories`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

// Get single product
export const getProduct = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};

// Create new product
export const createProduct = async (productData) => {
    try {
        const formData = new FormData();

        // Append all form fields except images
        Object.keys(productData).forEach(key => {
            if (key !== 'images') {
                formData.append(key, productData[key]);
            }
        });

        // Append images
        if (productData.images && productData.images.length > 0) {
            productData.images.forEach(image => {
                formData.append('images', image);
            });
        }

        const response = await fetch(`${API_BASE_URL}/api/products`, {
            method: 'POST',
            headers: getAuthHeadersMultipart(),
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }

        return result;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

// Update product
export const updateProduct = async (id, productData) => {
    try {
        const formData = new FormData();

        // Append all form fields except images and existingImages
        Object.keys(productData).forEach(key => {
            if (key !== 'images' && key !== 'existingImages') {
                formData.append(key, productData[key]);
            }
        });

        // Handle existing images
        if (productData.existingImages) {
            formData.append('existingImages', JSON.stringify(productData.existingImages));
        }

        // Append new images
        if (productData.images && productData.images.length > 0) {
            productData.images.forEach(image => {
                formData.append('images', image);
            });
        }

        const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
            method: 'PUT',
            headers: getAuthHeadersMultipart(),
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }

        return result;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

// Update product stock only
export const updateProductStock = async (id, stock) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products/${id}/stock`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ stock }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }

        return result;
    } catch (error) {
        console.error('Error updating stock:', error);
        throw error;
    }
};

// Delete product (soft delete)
export const deleteProduct = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }

        return result;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

// Get low stock products (Admin only)
export const getLowStockProducts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products/admin/low-stock`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching low stock products:', error);
        throw error;
    }
};

// Search products
export const searchProducts = async (searchQuery, filters = {}) => {
    try {
        const queryParams = new URLSearchParams({
            q: searchQuery,
            ...filters
        });

        const response = await fetch(`${API_BASE_URL}/api/products/search?${queryParams}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};