import axios, { type AxiosRequestConfig } from "axios";

// Base URL configuration (using Vite environment variable)
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const api = axios.create({
  baseURL: baseURL,
  // Add other configurations like timeout if needed
});

// Inject token automatically before any request is sent
// 💡 We let TypeScript infer the type of 'config' to resolve compatibility issues.
api.interceptors.request.use((config) => {
  // 1. Retrieve the token from storage
  const token = localStorage.getItem("token");

  // 2. Check if the token exists and the headers object is present
  // The 'headers' property is guaranteed to be present on internal request config, 
  // but we check existence and use 'as any' for maximum compatibility if needed.
  if (token && config.headers) {
    // 3. Attach the Bearer token to the Authorization header
    config.headers.Authorization = `Bearer ${token}`; 
  }

  return config;
}, (error) => {
    // Handle request error
    return Promise.reject(error);
});