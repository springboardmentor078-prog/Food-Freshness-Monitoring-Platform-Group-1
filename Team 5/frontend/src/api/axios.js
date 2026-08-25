import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 (expired tokens)
// Only redirect to login if the 401 is from a non-auth endpoint
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      // Don't clear session for auth endpoints (login/register failures are expected)
      const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');
      if (!isAuthEndpoint) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Only redirect if not already on auth pages
        if (!window.location.pathname.includes('/login') &&
            !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ───────────────────────────────────────────────────────────

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
};

// ─── Food Items API ─────────────────────────────────────────────────────

export const foodItemsAPI = {
  list: (params) => API.get('/food-items/', { params }),
  create: (data) => API.post('/food-items/', data),
  get: (id) => API.get(`/food-items/${id}`),
  update: (id, data) => API.put(`/food-items/${id}`, data),
  delete: (id) => API.delete(`/food-items/${id}`),
  getDashboardStats: () => API.get('/food-items/dashboard-stats'),
  getAdminStats: () => API.get('/food-items/admin-stats'),
};

// ─── Images API ─────────────────────────────────────────────────────────

export const imagesAPI = {
  upload: (foodItemId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return API.post(`/images/upload/${foodItemId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  list: (foodItemId) => API.get(`/images/${foodItemId}`),
  delete: (imageId) => API.delete(`/images/${imageId}`),
};

// ─── Predictions API ────────────────────────────────────────────────────

export const predictionsAPI = {
  run: (foodImageId) => API.post(`/predict/${foodImageId}`),
  getForImage: (foodImageId) => API.get(`/predict/${foodImageId}`),
  getForItem: (foodItemId) => API.get(`/predict/item/${foodItemId}`),
  getLatest: (foodItemId) => API.get(`/predict/latest/${foodItemId}`),
};

export default API;
