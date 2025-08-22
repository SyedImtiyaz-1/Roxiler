export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: 'ADMIN' | 'NORMAL_USER' | 'STORE_OWNER';
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner?: User;
  _count?: {
    ratings: number;
  };
}

export interface Rating {
  id: string;
  ratingValue: number;
  userId: string;
  storeId: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  store?: Store;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  address: string;
  password: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  address: string;
  password: string;
  role: 'ADMIN' | 'NORMAL_USER' | 'STORE_OWNER';
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  address?: string;
  role?: 'ADMIN' | 'NORMAL_USER' | 'STORE_OWNER';
}

export interface CreateStoreRequest {
  name: string;
  address: string;
  ownerId: string;
}

export interface UpdateStoreRequest {
  name?: string;
  address?: string;
  ownerId?: string;
}

export interface CreateRatingRequest {
  ratingValue: number;
  storeId: string;
}

export interface UpdateRatingRequest {
  ratingValue: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
} 