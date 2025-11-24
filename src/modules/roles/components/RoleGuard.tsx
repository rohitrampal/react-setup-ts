import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/modules/auth'
import { UserRole } from '../types'

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: UserRole[]
  fallback?: ReactNode
}

export const RoleGuard = ({ children, allowedRoles, fallback }: RoleGuardProps) => {
  const { t } = useTranslation()
  const { user, loading } = useAuth()

  if (loading) {
    return <div aria-label={t('common.loading')}>{t('common.loading')}</div>
  }

  if (!user) {
    return <Navigate to='/login' replace />
  }

  const userRole = (user as { role?: UserRole })?.role || 'customer'

  if (!allowedRoles.includes(userRole)) {
    return fallback ? <>{fallback}</> : <Navigate to='/dashboard' replace />
  }

  return <>{children}</>
}
