import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import { apiClient } from '@/services/api/client'
import { ApiResponse } from '@/services/api/types'

export interface UseApiMutationOptions<TData, TVariables>
  extends Omit<UseMutationOptions<ApiResponse<TData>, Error, TVariables>, 'mutationFn'> {
  endpoint: string
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  invalidateQueries?: string[]
  optimisticUpdate?: {
    queryKey: string[]
    updateFn: (variables: TVariables) => (oldData: unknown) => unknown
  }
}

export function useApiMutation<TData = unknown, TVariables = unknown>(
  options: UseApiMutationOptions<TData, TVariables>
): UseMutationResult<ApiResponse<TData>, Error, TVariables> {
  const queryClient = useQueryClient()
  const {
    endpoint,
    method = 'POST',
    invalidateQueries = [],
    optimisticUpdate,
    ...mutationOptions
  } = options

  return useMutation<ApiResponse<TData>, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      switch (method) {
        case 'POST':
          return await apiClient.post<TData>(endpoint, variables, {
            skipCache: true,
            skipDeduplication: true,
          })
        case 'PUT':
          return await apiClient.put<TData>(endpoint, variables, {
            skipCache: true,
            skipDeduplication: true,
          })
        case 'PATCH':
          return await apiClient.patch<TData>(endpoint, variables, {
            skipCache: true,
            skipDeduplication: true,
          })
        case 'DELETE':
          return await apiClient.delete<TData>(endpoint, {
            skipCache: true,
            skipDeduplication: true,
          })
        default:
          throw new Error(`Unsupported method: ${method}`)
      }
    },
    onMutate: optimisticUpdate
      ? async variables => {
          if (optimisticUpdate) {
            await queryClient.cancelQueries({ queryKey: optimisticUpdate.queryKey })
            const previousData = queryClient.getQueryData(optimisticUpdate.queryKey)
            queryClient.setQueryData(
              optimisticUpdate.queryKey,
              optimisticUpdate.updateFn(variables)
            )
            return { previousData }
          }
        }
      : undefined,
    onError: optimisticUpdate
      ? (_error, _variables, context) => {
          if (
            context &&
            typeof context === 'object' &&
            'previousData' in context &&
            context.previousData
          ) {
            queryClient.setQueryData(optimisticUpdate.queryKey, context.previousData)
          }
        }
      : undefined,
    onSettled: () => {
      invalidateQueries.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
      })
    },
    ...mutationOptions,
  })
}
