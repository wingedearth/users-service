export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: Address;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber?: string;
  address?: Address;
}

export interface UpdateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: Address;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}
