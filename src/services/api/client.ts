import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { env } from '@/config/env'
import { CacheManager } from '@/utils/cache'
import { requestDeduplication } from './deduplication'
import { rateLimiter } from './rateLimiter'
import { SecurityUtils } from '@/utils/security'
import type { ApiResponse, ApiError, RequestConfig, TokenRefreshResponse } from './types'

class ApiClient {
  private client: AxiosInstance
  private refreshTokenPromise: Promise<string> | null = null
  private csrfToken: string | null = null

  constructor() {
    this.client = axios.create({
      baseURL: env.apiUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
    this.initializeCSRFToken()
  }

  private initializeCSRFToken(): void {
    const stored = localStorage.getItem('csrf_token')
    if (stored) {
      this.csrfToken = stored
    } else {
      this.csrfToken = SecurityUtils.generateCSRFToken()
      localStorage.setItem('csrf_token', this.csrfToken)
    }
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const requestConfig = config as InternalAxiosRequestConfig & RequestConfig
        const token = this.getAccessToken()
        if (token && !requestConfig.skipAuth) {
          config.headers.Authorization = `Bearer ${token}`
        }

        if (this.csrfToken) {
          config.headers['X-CSRF-Token'] = this.csrfToken
        }

        config.headers['X-Requested-With'] = 'XMLHttpRequest'

        return config
      },
      (error: unknown) => {
        return Promise.reject(error)
      }
    )

    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        return response
      },
      async (error: unknown) => {
        if (!axios.isAxiosError(error)) {
          return Promise.reject(this.formatError(error))
        }

        const originalRequest = error.config as
          | (InternalAxiosRequestConfig & RequestConfig)
          | undefined

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const newToken = await this.refreshAccessToken()
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return this.client(originalRequest)
          } catch (refreshError) {
            this.handleLogout()
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(this.formatError(error))
      }
    )
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise
    }

    this.refreshTokenPromise = (async () => {
      try {
        const refreshToken = this.getRefreshToken()
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await axios.post<TokenRefreshResponse>(`${env.apiUrl}/auth/refresh`, {
          refreshToken,
        })

        const { accessToken, refreshToken: newRefreshToken } = response.data

        this.setTokens(accessToken, newRefreshToken)

        return accessToken
      } catch (error) {
        this.handleLogout()
        throw error
      } finally {
        this.refreshTokenPromise = null
      }
    })()

    return this.refreshTokenPromise
  }

  private formatError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      return {
        message: error.response?.data?.message || error.message || 'An error occurred',
        status: error.response?.status || 500,
        errors: error.response?.data?.errors,
      }
    }

    return {
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500,
    }
  }

  private getAccessToken(): string | null {
    return localStorage.getItem('access_token')
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token')
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
  }

  private handleLogout(): void {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    window.location.href = '/login'
  }

  private generateCacheKey(method: string, url: string, params?: unknown): string {
    return `api_cache_${method}_${url}_${JSON.stringify(params || {})}`
  }

  async get<T>(url: string, config?: RequestConfig & AxiosRequestConfig): Promise<ApiResponse<T>> {
    const cacheKey = this.generateCacheKey('GET', url, config?.params)
    const ttl = config?.ttl || 300000

    if (!config?.skipCache && CacheManager.has(cacheKey)) {
      const cached = CacheManager.get<ApiResponse<T>>(cacheKey)
      if (cached) return cached
    }

    await rateLimiter.checkLimit(url)

    const requestFn = () =>
      this.client
        .get<ApiResponse<T>>(url, config)
        .then((res: AxiosResponse<ApiResponse<T>>) => res.data)

    const key = requestDeduplication.generateKey('GET', url, config?.params)
    const data = config?.skipDeduplication
      ? await requestFn()
      : await requestDeduplication.deduplicate(key, requestFn)

    if (!config?.skipCache) {
      CacheManager.set(cacheKey, data, ttl)
    }

    return data
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig & AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    await rateLimiter.checkLimit(url)

    const requestFn = () =>
      this.client
        .post<ApiResponse<T>>(url, data, config)
        .then((res: AxiosResponse<ApiResponse<T>>) => res.data)

    const key = requestDeduplication.generateKey('POST', url, data)
    return config?.skipDeduplication
      ? await requestFn()
      : await requestDeduplication.deduplicate(key, requestFn)
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig & AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    await rateLimiter.checkLimit(url)

    const requestFn = () =>
      this.client
        .put<ApiResponse<T>>(url, data, config)
        .then((res: AxiosResponse<ApiResponse<T>>) => res.data)

    const key = requestDeduplication.generateKey('PUT', url, data)
    return config?.skipDeduplication
      ? await requestDeduplication.deduplicate(key, requestFn)
      : await requestFn()
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig & AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    await rateLimiter.checkLimit(url)

    const requestFn = () =>
      this.client
        .patch<ApiResponse<T>>(url, data, config)
        .then((res: AxiosResponse<ApiResponse<T>>) => res.data)

    const key = requestDeduplication.generateKey('PATCH', url, data)
    return config?.skipDeduplication
      ? await requestDeduplication.deduplicate(key, requestFn)
      : await requestFn()
  }

  async delete<T>(
    url: string,
    config?: RequestConfig & AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    await rateLimiter.checkLimit(url)

    return this.client
      .delete<ApiResponse<T>>(url, config)
      .then((res: AxiosResponse<ApiResponse<T>>) => res.data)
  }
}

export const apiClient = new ApiClient()
