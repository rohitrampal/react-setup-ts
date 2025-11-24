import { ReactNode } from 'react'
import { Box, Typography, Button } from '@mui/material'
import { ErrorOutline, Refresh } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { ErrorBoundary } from './ErrorBoundary'

interface ModuleErrorBoundaryProps {
  children: ReactNode
  moduleName: string
  onReset?: () => void
}

const ModuleErrorFallback = ({
  error,
  moduleName,
  onReset,
}: {
  error: Error | null
  moduleName: string
  onReset?: () => void
}) => {
  const { t } = useTranslation()

  return (
    <Box
      className='tw-p-4 tw-bg-red-50 tw-rounded-lg tw-border tw-border-red-200'
      role='alert'
      aria-live='polite'
    >
      <Box className='tw-flex tw-items-start tw-gap-3'>
        <ErrorOutline className='tw-text-red-500 tw-mt-1' />
        <Box className='tw-flex-1'>
          <Typography variant='h6' component='h3' className='tw-mb-1 tw-text-red-800'>
            {t('errors.moduleError', { module: moduleName })}
          </Typography>
          <Typography variant='body2' color='textSecondary' className='tw-mb-3'>
            {t('errors.moduleErrorDescription')}
          </Typography>
          {error && (
            <Typography
              variant='caption'
              className='tw-block tw-mb-3 tw-p-2 tw-bg-white tw-rounded tw-font-mono tw-text-xs tw-overflow-auto'
            >
              {error.message}
            </Typography>
          )}
          {onReset && (
            <Button
              size='small'
              variant='outlined'
              startIcon={<Refresh />}
              onClick={onReset}
              aria-label={t('errors.reloadModule')}
            >
              {t('errors.reloadModule')}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export const ModuleErrorBoundary = ({
  children,
  moduleName,
  onReset,
}: ModuleErrorBoundaryProps) => {
  return (
    <ErrorBoundary
      onError={error => {
        console.error(`Error in module ${moduleName}:`, error)
      }}
      fallback={error => (
        <ModuleErrorFallback error={error} moduleName={moduleName} onReset={onReset} />
      )}
    >
      {children}
    </ErrorBoundary>
  )
}
