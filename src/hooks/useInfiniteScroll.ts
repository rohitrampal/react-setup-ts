import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query'
import { apiClient } from '@/services/api/client'
import { ApiResponse } from '@/services/api/types'

export interface InfiniteResponse<T> {
  data: T[]
  nextPage?: number
  hasMore: boolean
}

export interface UseInfiniteScrollOptions<T> {
  endpoint: string
  pageSize?: number
  enabled?: boolean
  getNextPageParam?: (
    lastPage: ApiResponse<InfiniteResponse<T>>,
    allPages: ApiResponse<InfiniteResponse<T>>[]
  ) => number | undefined
}

export interface UseInfiniteScrollReturn<T> {
  data: InfiniteData<ApiResponse<InfiniteResponse<T>>> | undefined
  fetchNextPage: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
  allItems: T[]
}

export function useInfiniteScroll<T = unknown>(
  options: UseInfiniteScrollOptions<T>
): UseInfiniteScrollReturn<T> {
  const {
    endpoint,
    pageSize = 10,
    enabled = true,
    getNextPageParam = lastPage => {
      const data = lastPage.data
      return data?.hasMore ? data.nextPage : undefined
    },
  } = options

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery<ApiResponse<InfiniteResponse<T>>>({
    queryKey: [endpoint, 'infinite', pageSize],
    queryFn: async ({ pageParam = 1 }) => {
      return await apiClient.get<InfiniteResponse<T>>(endpoint, {
        params: { page: pageParam, pageSize },
        skipCache: false,
        ttl: 30000,
      })
    },
    getNextPageParam,
    enabled,
    staleTime: 30000,
    initialPageParam: 1,
  })

  const allItems = data?.pages.flatMap(page => page.data?.data || []) || []

  return {
    data,
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isFetchingNextPage,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
    allItems,
  }
}
