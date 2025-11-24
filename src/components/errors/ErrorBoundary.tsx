import { Component, ReactNode, ErrorInfo } from 'react'
import { Box, Typography, Button, Paper } from '@mui/material'
import { ErrorOutline, Refresh } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode | ((error: Error | null, reset: () => void) => ReactNode)
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  resetKeys?: unknown[]
  onReset?: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys } = this.props
    const { hasError } = this.state

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys && resetKeys.length > 0) {
        this.resetErrorBoundary()
      }
    }
  }

  resetErrorBoundary = () => {
    const { onReset } = this.props
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })

    if (onReset) {
      onReset()
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback(this.state.error, this.resetErrorBoundary) as ReactNode
        }
        return this.props.fallback
      }

      return <ErrorFallback error={this.state.error} onReset={this.resetErrorBoundary} />
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error: Error | null
  onReset: () => void
}

const ErrorFallback = ({ error, onReset }: ErrorFallbackProps) => {
  const { t } = useTranslation()

  const isUndefinedError = error?.message?.includes('undefined') || 
                          error?.message?.includes('Cannot read') ||
                          error?.stack?.includes('undefined')

  return (
    <Box
      className="tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-p-4 tw-bg-gray-50"
      role="alert"
      aria-live="assertive"
    >
      <Paper
        className="tw-max-w-md tw-w-full tw-p-6 tw-text-center"
        elevation={3}
      >
        <ErrorOutline
          className="tw-text-red-500 tw-mb-4"
          style={{ fontSize: 64 }}
          aria-hidden="true"
        />

        <Typography variant="h5" component="h1" className="tw-mb-2 tw-font-bold">
          {isUndefinedError ? t('errors.undefinedError') : t('errors.somethingWentWrong')}
        </Typography>

        <Typography variant="body2" color="textSecondary" className="tw-mb-4">
          {isUndefinedError
            ? t('errors.undefinedErrorDescription')
            : t('errors.errorDescription')}
        </Typography>

        {error && (
          <Box
            className="tw-mb-4 tw-p-3 tw-bg-gray-100 tw-rounded tw-text-left tw-text-xs tw-font-mono tw-overflow-auto tw-max-h-32"
            component="details"
          >
            <summary className="tw-cursor-pointer tw-font-semibold tw-mb-2">
              {t('errors.errorDetails')}
            </summary>
            <pre className="tw-whitespace-pre-wrap tw-text-red-600">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </Box>
        )}

        <Box className="tw-flex tw-gap-2 tw-justify-center">
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={onReset}
            aria-label={t('errors.tryAgain')}
          >
            {t('errors.tryAgain')}
          </Button>
          <Button
            variant="outlined"
            onClick={() => window.location.reload()}
            aria-label={t('errors.reloadPage')}
          >
            {t('errors.reloadPage')}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

