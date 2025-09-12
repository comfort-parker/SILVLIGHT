import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request Interceptor - attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Response Interceptor
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ========== AUTH ==========
export const registerUser = (data) => API.post("/auth/register", data);
export const verifyOtp = (data) => API.post("/auth/verify-otp", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const forgotPassword = (data) => API.post("/auth/forgot-password", data);
export const resetPassword = (token, data) =>
  API.put(`/auth/reset-password?token=${token}`, data);

export const getProfile = () => API.get("/auth/profile");
export const updateProfile = (data) => API.put("/auth/profile", data);

// ========== USERS (Admin only) ==========
export const getUsers = () => API.get("/auth/users");
export const getUserById = (id) => API.get(`/auth/users/${id}`);
export const updateUserByAdmin = (id, data) =>
  API.put(`/auth/users/${id}`, data);
export const deleteUserByAdmin = (id) => API.delete(`/auth/users/${id}`);


// ========== PRODUCTS ==========
export const getProducts = () => API.get("/products");
export const getProductById = (id) => API.get(`/products/${id}`);
export const createProduct = (data) =>
  API.post("/products", data, { headers: { "Content-Type": "application/json" } });
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// ========== ORDERS ==========
export const getOrders = () => API.get("/orders");
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const getUserOrders = () => API.get("/orders/user");
export const createOrder = (data) => API.post("/orders", data);
// src/Api.js
export const updateOrderStatus = (id, status) =>
  API.patch(`/orders/${id}/status`, { status });

export const getOrderStats = () => API.get("/orders/stats");
