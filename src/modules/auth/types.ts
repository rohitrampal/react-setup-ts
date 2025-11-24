export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  confirmPassword: string
  name: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export type UserRole = 'customer' | 'waiter' | 'chef' | 'manager' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role?: UserRole
  avatar?: string
}
