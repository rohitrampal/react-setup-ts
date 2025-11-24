export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  status: number
}

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

export interface RequestConfig {
  skipAuth?: boolean
  skipCache?: boolean
  skipDeduplication?: boolean
  ttl?: number
  timeout?: number
  _retry?: boolean
}

export interface TokenRefreshResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}
