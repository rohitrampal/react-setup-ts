import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiMutation } from '@/hooks/useMutation'
import { apiClient } from '@/services/api/client'
import { ApiResponse } from '@/services/api/types'

export interface ListItem {
  id: string
  name: string
  email: string
  role: string
  status: string
}

export interface CreateListItemData {
  name: string
  email: string
  role: string
}

export interface UpdateListItemData extends Partial<CreateListItemData> {
  id: string
}

const LIST_KEYS = {
  all: ['list'] as const,
  items: () => [...LIST_KEYS.all, 'items'] as const,
  item: (id: string) => [...LIST_KEYS.items(), id] as const,
  search: (term: string) => [...LIST_KEYS.items(), 'search', term] as const
}

export const useListItems = (searchTerm?: string) => {
  return useQuery({
    queryKey: searchTerm ? LIST_KEYS.search(searchTerm) : LIST_KEYS.items(),
    queryFn: async () => {
      const response = await apiClient.get<ListItem[]>('/list/items', {
        params: searchTerm ? { search: searchTerm } : undefined,
        skipCache: false,
        ttl: 60000
      })
      return response.data
    },
    staleTime: 30000,
    gcTime: 5 * 60 * 1000
  })
}

export const useCreateListItem = () => {
  const queryClient = useQueryClient()

  return useApiMutation<ListItem, CreateListItemData>({
    endpoint: '/list/items',
    method: 'POST',
    invalidateQueries: ['list'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LIST_KEYS.items() })
    },
    optimisticUpdate: {
      queryKey: Array.from(LIST_KEYS.items()),
      updateFn: (variables) => (oldData) => {
        const old = oldData as ListItem[] | undefined
        const newItem: ListItem = {
          id: `temp-${Date.now()}`,
          name: variables.name,
          email: variables.email,
          role: variables.role,
          status: 'Active'
        }
        return old ? [...old, newItem] : [newItem]
      }
    }
  })
}

export const useUpdateListItem = () => {
  const queryClient = useQueryClient()

  return useApiMutation<ListItem, UpdateListItemData>({
    endpoint: '/list/items',
    method: 'PUT',
    invalidateQueries: ['list'],
    onSuccess: (data, variables) => {
      queryClient.setQueryData(LIST_KEYS.item(variables.id), data.data)
      queryClient.invalidateQueries({ queryKey: LIST_KEYS.items() })
    },
    optimisticUpdate: {
      queryKey: Array.from(LIST_KEYS.items()),
      updateFn: (variables) => (oldData) => {
        const old = oldData as ListItem[] | undefined
        if (!old) return old
        return old.map((item) =>
          item.id === variables.id ? { ...item, ...variables } : item
        )
      }
    }
  })
}

export const useDeleteListItem = () => {
  const queryClient = useQueryClient()

  return useApiMutation<void, { id: string }>({
    endpoint: '/list/items',
    method: 'DELETE',
    invalidateQueries: ['list'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LIST_KEYS.items() })
    },
    optimisticUpdate: {
      queryKey: Array.from(LIST_KEYS.items()),
      updateFn: (variables) => (oldData) => {
        const old = oldData as ListItem[] | undefined
        if (!old) return old
        return old.filter((item) => item.id !== variables.id)
      }
    }
  })
}

