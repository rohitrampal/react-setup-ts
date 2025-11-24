import { useMemo } from 'react'
import { useAuth } from '@/modules/auth'
import { UserRole, ROLE_PERMISSIONS, RolePermissions } from '../types'

export const useRole = () => {
  const { user } = useAuth()

  const role: UserRole = useMemo(() => {
    if (!user) return 'customer'
    return (user as { role?: UserRole })?.role || 'customer'
  }, [user])

  const permissions: RolePermissions = useMemo(() => {
    return ROLE_PERMISSIONS[role]
  }, [role])

  const hasPermission = (permission: keyof RolePermissions): boolean => {
    return permissions[permission]
  }

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.includes(role)
  }

  return {
    role,
    permissions,
    hasPermission,
    hasAnyRole,
    isCustomer: role === 'customer',
    isWaiter: role === 'waiter',
    isChef: role === 'chef',
    isManager: role === 'manager',
    isAdmin: role === 'admin',
  }
}
