export type UserRole = 'customer' | 'waiter' | 'chef' | 'manager' | 'admin'

export interface RolePermissions {
  canViewOrders: boolean
  canCreateOrders: boolean
  canUpdateOrderStatus: boolean
  canViewMenu: boolean
  canManageMenu: boolean
  canViewTables: boolean
  canManageTables: boolean
  canViewAnalytics: boolean
  canManageUsers: boolean
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  customer: {
    canViewOrders: true,
    canCreateOrders: true,
    canUpdateOrderStatus: false,
    canViewMenu: true,
    canManageMenu: false,
    canViewTables: false,
    canManageTables: false,
    canViewAnalytics: false,
    canManageUsers: false
  },
  waiter: {
    canViewOrders: true,
    canCreateOrders: true,
    canUpdateOrderStatus: true,
    canViewMenu: true,
    canManageMenu: false,
    canViewTables: true,
    canManageTables: false,
    canViewAnalytics: false,
    canManageUsers: false
  },
  chef: {
    canViewOrders: true,
    canCreateOrders: false,
    canUpdateOrderStatus: true,
    canViewMenu: true,
    canManageMenu: false,
    canViewTables: false,
    canManageTables: false,
    canViewAnalytics: false,
    canManageUsers: false
  },
  manager: {
    canViewOrders: true,
    canCreateOrders: true,
    canUpdateOrderStatus: true,
    canViewMenu: true,
    canManageMenu: true,
    canViewTables: true,
    canManageTables: true,
    canViewAnalytics: true,
    canManageUsers: true
  },
  admin: {
    canViewOrders: true,
    canCreateOrders: true,
    canUpdateOrderStatus: true,
    canViewMenu: true,
    canManageMenu: true,
    canViewTables: true,
    canManageTables: true,
    canViewAnalytics: true,
    canManageUsers: true
  }
}

