import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { apiClient } from '@/services/api/client'
import { ApiResponse } from '@/services/api/types'

export interface UseApiQueryOptions<T> extends Omit<UseQueryOptions<ApiResponse<T>>, 'queryFn'> {
  endpoint: string
  enabled?: boolean
  staleTime?: number
  gcTime?: number
}

export function useApiQuery<T = unknown>(
  options: UseApiQueryOptions<T>
): UseQueryResult<ApiResponse<T>> {
  const { endpoint, enabled = true, staleTime, gcTime, queryKey, ...queryOptions } = options

  return useQuery<ApiResponse<T>>({
    queryKey: [endpoint, queryKey?.[1]],
    queryFn: async () => {
      return await apiClient.get<T>(endpoint, {
        skipCache: true,
        skipDeduplication: false
      })
    },
    enabled,
    staleTime,
    gcTime,
    ...queryOptions
  })
}

