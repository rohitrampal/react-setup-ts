import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentUser, useLogin, useRegister, useLogout } from './useAuthQuery'
import type { LoginCredentials, RegisterData } from '../types'

interface UseAuthReturn {
  user: ReturnType<typeof useCurrentUser>['data']
  loading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
}

export const useAuth = (): UseAuthReturn => {
  const navigate = useNavigate()
  const { data: user, isLoading: loading } = useCurrentUser()
  const loginMutation = useLogin()
  const registerMutation = useRegister()
  const logoutMutation = useLogout()

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      await loginMutation.mutateAsync(credentials)
      navigate('/dashboard')
    },
    [loginMutation, navigate]
  )

  const register = useCallback(
    async (data: RegisterData) => {
      await registerMutation.mutateAsync(data)
      navigate('/dashboard')
    },
    [registerMutation, navigate]
  )

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync()
    navigate('/login')
  }, [logoutMutation, navigate])

  return {
    user: user || undefined,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout
  }
}
