import { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import { ErrorOutline } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface ComponentErrorFallbackProps {
  componentName?: string
  error?: Error | null
  children?: ReactNode
  size?: 'small' | 'medium' | 'large'
}

export const ComponentErrorFallback = ({
  componentName,
  error,
  children,
  size = 'medium',
}: ComponentErrorFallbackProps) => {
  const { t } = useTranslation()

  const isUndefinedError =
    error?.message?.includes('undefined') || error?.message?.includes('Cannot read')

  const sizeClasses = {
    small: 'tw-p-2 tw-text-xs',
    medium: 'tw-p-3 tw-text-sm',
    large: 'tw-p-4 tw-text-base',
  }

  return (
    <Box
      className={`tw-bg-yellow-50 tw-border tw-border-yellow-200 tw-rounded tw-flex tw-items-center tw-gap-2 ${sizeClasses[size]}`}
      role='alert'
      aria-live='polite'
    >
      <ErrorOutline className='tw-text-yellow-600 tw-flex-shrink-0' fontSize='small' />
      <Box className='tw-flex-1'>
        <Typography variant='body2' className='tw-text-yellow-800'>
          {componentName
            ? t('errors.componentError', { component: componentName })
            : isUndefinedError
              ? t('errors.undefinedError')
              : t('errors.componentLoadError')}
        </Typography>
        {error?.message && (
          <Typography variant='caption' className='tw-text-yellow-700 tw-mt-1 tw-block'>
            {error.message}
          </Typography>
        )}
      </Box>
      {children}
    </Box>
  )
}

export const SafeComponent = ({
  children,
  componentName,
  fallback,
}: {
  children: ReactNode
  componentName?: string
  fallback?: ReactNode
}) => {
  try {
    if (children === null || children === undefined) {
      return fallback || <ComponentErrorFallback componentName={componentName} size='small' />
    }
    return <>{children}</>
  } catch (error) {
    return (
      fallback || <ComponentErrorFallback componentName={componentName} error={error as Error} />
    )
  }
}
