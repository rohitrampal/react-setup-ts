import { apiClient } from '@/services/api/client'
import type { LoginCredentials, RegisterData, AuthResponse } from '../types'

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      '/auth/login',
      credentials,
      { skipAuth: true, skipCache: true, skipDeduplication: true }
    )
    return response.data
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      '/auth/register',
      data,
      { skipAuth: true, skipCache: true, skipDeduplication: true }
    )
    return response.data
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout', {}, { skipCache: true })
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me')
    return response.data
  }
}

