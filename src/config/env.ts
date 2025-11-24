export const env = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  appMode: import.meta.env.VITE_APP_MODE || 'development',
  enableDevTools: import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true',
} as const

export type AppMode = 'development' | 'production' | 'staging'
