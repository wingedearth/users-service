export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}
