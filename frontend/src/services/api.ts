import axios from 'axios';
import type {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  ChangePasswordRequest,
  User,
  Store,
  Rating,
  CreateUserRequest,
  UpdateUserRequest,
  CreateStoreRequest,
  UpdateStoreRequest,
  CreateRatingRequest,
  UpdateRatingRequest,
  DashboardStats,
} from '../types';

// Use relative URL for production (Vercel) or environment variable for development
const API_BASE_URL = import.meta.env.PROD 
  ? '/api' 
  : (import.meta.env.VITE_API_URL || 'http://localhost:3001');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data: LoginRequest): Promise<AuthResponse> =>
    api.post('/auth/login', data).then((res) => res.data),

  signup: (data: SignupRequest): Promise<AuthResponse> =>
    api.post('/auth/signup', data).then((res) => res.data),

  changePassword: (data: ChangePasswordRequest): Promise<{ message: string }> =>
    api.post('/auth/change-password', data).then((res) => res.data),

  getProfile: (): Promise<User> =>
    api.get('/auth/profile').then((res) => res.data),
};

// Users API
export const usersAPI = {
  getAll: (params?: any): Promise<User[]> =>
    api.get('/users', { params }).then((res) => res.data),

  getById: (id: string): Promise<User> =>
    api.get(`/users/${id}`).then((res) => res.data),

  create: (data: CreateUserRequest): Promise<User> =>
    api.post('/users', data).then((res) => res.data),

  update: (id: string, data: UpdateUserRequest): Promise<User> =>
    api.patch(`/users/${id}`, data).then((res) => res.data),

  delete: (id: string): Promise<{ message: string }> =>
    api.delete(`/users/${id}`).then((res) => res.data),

  getDashboardStats: (): Promise<DashboardStats> =>
    api.get('/users/dashboard-stats').then((res) => res.data),
};

// Stores API
export const storesAPI = {
  getAll: (params?: any): Promise<Store[]> =>
    api.get('/stores', { params }).then((res) => res.data),

  getById: (id: string): Promise<Store> =>
    api.get(`/stores/${id}`).then((res) => res.data),

  getMyStores: (): Promise<Store[]> =>
    api.get('/stores/my-stores').then((res) => res.data),

  create: (data: CreateStoreRequest): Promise<Store> =>
    api.post('/stores', data).then((res) => res.data),

  update: (id: string, data: UpdateStoreRequest): Promise<Store> =>
    api.patch(`/stores/${id}`, data).then((res) => res.data),

  delete: (id: string): Promise<{ message: string }> =>
    api.delete(`/stores/${id}`).then((res) => res.data),

  getAverageRating: (id: string): Promise<{ averageRating: number; totalRatings: number }> =>
    api.get(`/stores/${id}/average-rating`).then((res) => res.data),
};

// Ratings API
export const ratingsAPI = {
  getAll: (): Promise<Rating[]> =>
    api.get('/ratings').then((res) => res.data),

  getById: (id: string): Promise<Rating> =>
    api.get(`/ratings/${id}`).then((res) => res.data),

  getMyRatings: (): Promise<Rating[]> =>
    api.get('/ratings/my-ratings').then((res) => res.data),

  getByStore: (storeId: string): Promise<Rating[]> =>
    api.get(`/ratings/store/${storeId}`).then((res) => res.data),

  getUserRatingForStore: (storeId: string): Promise<Rating | null> =>
    api.get(`/ratings/user-rating/${storeId}`).then((res) => res.data),

  create: (data: CreateRatingRequest): Promise<Rating> =>
    api.post('/ratings', data).then((res) => res.data),

  update: (id: string, data: UpdateRatingRequest): Promise<Rating> =>
    api.patch(`/ratings/${id}`, data).then((res) => res.data),

  delete: (id: string): Promise<{ message: string }> =>
    api.delete(`/ratings/${id}`).then((res) => res.data),
};

export default api; 