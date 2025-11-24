import { Suspense, ReactNode } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface LazySuspenseProps {
  children: ReactNode
  fallback?: ReactNode
  minHeight?: string
  showText?: boolean
}

export const LazySuspense = ({
  children,
  fallback,
  minHeight = '400px',
  showText = true
}: LazySuspenseProps) => {
  const { t } = useTranslation()

  const defaultFallback = (
    <Box
      className="tw-flex tw-flex-col tw-items-center tw-justify-center"
      style={{ minHeight }}
      role="status"
      aria-label={t('common.loading')}
    >
      <CircularProgress size={48} className="tw-mb-4" />
      {showText && (
        <Typography variant="body2" color="textSecondary">
          {t('common.loading')}
        </Typography>
      )}
    </Box>
  )

  return <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>
}

export const PageSuspense = ({ children }: { children: ReactNode }) => {
  return (
    <LazySuspense minHeight="60vh" showText={true}>
      {children}
    </LazySuspense>
  )
}

export const ComponentSuspense = ({ children }: { children: ReactNode }) => {
  return (
    <LazySuspense minHeight="200px" showText={false}>
      {children}
    </LazySuspense>
  )
}

