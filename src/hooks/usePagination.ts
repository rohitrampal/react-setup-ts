import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { apiClient } from '@/services/api/client'
import { ApiResponse } from '@/services/api/types'

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface UsePaginationOptions {
  endpoint: string
  pageSize?: number
  enabled?: boolean
  staleTime?: number
}

export interface UsePaginationReturn<T> {
  data: T[] | undefined
  total: number
  page: number
  pageSize: number
  totalPages: number
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
  setPage: (page: number) => void
  nextPage: () => void
  previousPage: () => void
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export function usePagination<T = unknown>(options: UsePaginationOptions): UsePaginationReturn<T> {
  const { endpoint, pageSize = 10, enabled = true, staleTime } = options
  const [page, setPage] = useState(1)

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ApiResponse<PaginatedResponse<T>>>({
    queryKey: [endpoint, 'pagination', page, pageSize],
    queryFn: async () => {
      return await apiClient.get<PaginatedResponse<T>>(endpoint, {
        params: { page, pageSize },
        skipCache: false,
        ttl: 30000,
      })
    },
    enabled,
    staleTime: staleTime || 30000,
    placeholderData: previousData => previousData,
  })

  const paginatedData = response?.data
  const totalPages = paginatedData?.totalPages || 0
  const total = paginatedData?.total || 0

  const nextPage = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1)
    }
  }

  const previousPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1)
    }
  }

  return {
    data: paginatedData?.data,
    total,
    page,
    pageSize,
    totalPages,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
    setPage,
    nextPage,
    previousPage,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  }
}
