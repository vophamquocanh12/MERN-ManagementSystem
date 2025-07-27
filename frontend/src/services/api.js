// 📁 frontend/src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Comes from .env.production or .env
  timeout: import.meta.env.VITE_API_TIMEOUT || 10000,
});

// 🔐 Auto attach token dynamically on each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
