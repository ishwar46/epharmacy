import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const PUBLIC_API_URL = `${API_BASE_URL}/api/hero-banner`;
const ADMIN_API_URL = `${API_BASE_URL}/api/admin/hero-banner`;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

// Public API - Get hero banner data
export const getHeroBannerData = async () => {
  const response = await fetch(PUBLIC_API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch hero banner data');
  }
  return response.json();
};

// Admin APIs - Slides
export const getAllSlides = async () => {
  const response = await axios.get(`${ADMIN_API_URL}/slides`, getAuthHeaders());
  return response.data;
};

export const createSlide = async (slideData) => {
  const response = await axios.post(`${ADMIN_API_URL}/slides`, slideData, getAuthHeaders());
  return response.data;
};

export const updateSlide = async (id, slideData) => {
  const response = await axios.put(`${ADMIN_API_URL}/slides/${id}`, slideData, getAuthHeaders());
  return response.data;
};

export const deleteSlide = async (id) => {
  const response = await axios.delete(`${ADMIN_API_URL}/slides/${id}`, getAuthHeaders());
  return response.data;
};

export const reorderSlides = async (slideOrders) => {
  const response = await axios.post(`${ADMIN_API_URL}/slides/reorder`, { slideOrders }, getAuthHeaders());
  return response.data;
};

// Admin APIs - Features
export const getAllFeatures = async () => {
  const response = await axios.get(`${ADMIN_API_URL}/features`, getAuthHeaders());
  return response.data;
};

export const createFeature = async (featureData) => {
  const response = await axios.post(`${ADMIN_API_URL}/features`, featureData, getAuthHeaders());
  return response.data;
};

export const updateFeature = async (id, featureData) => {
  const response = await axios.put(`${ADMIN_API_URL}/features/${id}`, featureData, getAuthHeaders());
  return response.data;
};

export const deleteFeature = async (id) => {
  const response = await axios.delete(`${ADMIN_API_URL}/features/${id}`, getAuthHeaders());
  return response.data;
};

export const reorderFeatures = async (featureOrders) => {
  const response = await axios.post(`${ADMIN_API_URL}/features/reorder`, { featureOrders }, getAuthHeaders());
  return response.data;
};

// Admin APIs - Configuration
export const getConfig = async () => {
  const response = await axios.get(`${ADMIN_API_URL}/config`, getAuthHeaders());
  return response.data;
};

export const updateConfig = async (configData) => {
  const response = await axios.put(`${ADMIN_API_URL}/config`, configData, getAuthHeaders());
  return response.data;
};