import { useState, useCallback } from 'react'
import { errorHandler } from '@/utils/errorHandler'

export function useSafeState<T>(initialValue: T | (() => T)) {
  const [state, setState] = useState<T>(initialValue)

  const safeSetState = useCallback((value: T | ((prev: T) => T)) => {
    try {
      setState(value)
    } catch (error) {
      errorHandler.logError(error as Error)
      console.error('Error in setState:', error)
    }
  }, [])

  return [state, safeSetState] as const
}

export function useSafeValue<T>(value: T | undefined | null, fallback: T): T {
  if (value === undefined || value === null) {
    if (import.meta.env.VITE_APP_MODE === 'development') {
      console.warn('Undefined or null value detected, using fallback:', { value, fallback })
    }
    return fallback
  }
  return value
}
