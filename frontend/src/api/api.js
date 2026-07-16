import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const AUTH_API = axios.create({
  baseURL: BASE_URL,
});

AUTH_API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const handleResponse = (res) => res;

const handleError = (error) => {
  const message =
    error.response?.data?.message ||
    error.message ||
    "Something went wrong";

  console.error("API ERROR:", message);

  if (error.response?.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  }

  return Promise.reject({
    success: false,
    message,
    status: error.response?.status,
  });
};

API.interceptors.response.use(handleResponse, handleError);
AUTH_API.interceptors.response.use(handleResponse, handleError);

// Helper to normalize function arguments (supporting both object destructuring and raw page number queries)
const normalizeParams = (params) => {
  if (typeof params === "object" && params !== null) {
    return params;
  }
  return { page: params };
};

// ================= AUTH =================
export const registerUser = (data) =>
  API.post("/auth/register", data);

export const loginUser = (data) =>
  API.post("/auth/login", data);

export const sendOtp = (email) =>
  API.post("/auth/send-otp", { email });

export const verifyOtp = (email, otp) =>
  API.post("/auth/verify-otp", { email, otp });

// ================= FILE UPLOAD =================
export const uploadFile = (formData) =>
  AUTH_API.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// ================= USER =================
export const getUserById = (id) =>
  API.get(`/user/get/${id}`);

export const updateUserById = (id, data) =>
  AUTH_API.put(`/user/update/${id}`, data);

// ================= CAST =================
export const createCast = (data) =>
  AUTH_API.post("/cast/create", data);

export const getCasts = (params) =>
  API.get(`/cast/get`, {
    params: normalizeParams(params)
  });

export const getCastById = (id) =>
  API.get(`/cast/get/${id}`);

export const updateCast = (id, data) =>
  AUTH_API.put(`/cast/update/${id}`, data);

export const deleteCast = (id) =>
  AUTH_API.delete(`/cast/delete/${id}`);

// ================= CATEGORY =================
export const createCategory = (data) =>
  AUTH_API.post("/category/create", data);

export const getCategoryById = (id) =>
  API.get(`/category/get/${id}`);

export const getCategories = (params) =>
  API.get(`/category/get`, {
    params: normalizeParams(params)
  });

export const updateCategory = (id, data) =>
  AUTH_API.put(`/category/update/${id}`, data); 

export const deleteCategory = (id) =>
  AUTH_API.delete(`/category/delete/${id}`);

// ================= MOVIE =================
export const createMovie = (data) =>
  AUTH_API.post("/movie/create", data);

export const getMovies = (params) =>
  API.get(`/movie/get`, {
    params: normalizeParams(params)
  });

export const getMovieById = (id) =>
  API.get(`/movie/get/${id}`);

export const updateMovie = (id, data) =>
  AUTH_API.put(`/movie/update/${id}`, data);

export const deleteMovie = (id) =>
  AUTH_API.delete(`/movie/delete/${id}`);

// ================= HISTORY =================
export const watchMovie = (movieId) =>
  AUTH_API.post(`/history/watch/${movieId}`);

export const downloadMovie = (movieId) =>
  AUTH_API.post(`/downloads/${movieId}`);

export const getDownloads = (params) =>
  AUTH_API.get(`/downloads`, {
    params: normalizeParams(params)
  });

export const getHistory = (params) =>
  AUTH_API.get(`/history`, {
    params: normalizeParams(params)
  });