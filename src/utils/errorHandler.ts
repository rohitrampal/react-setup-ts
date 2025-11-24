export interface ErrorInfo {
  message: string
  stack?: string
  componentStack?: string
  timestamp: Date
  userAgent?: string
  url?: string
  userId?: string
}

class ErrorHandler {
  private errors: ErrorInfo[] = []
  private maxErrors = 50

  logError(error: Error, errorInfo?: { componentStack?: string }) {
    const errorData: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    this.errors.push(errorData)

    if (this.errors.length > this.maxErrors) {
      this.errors.shift()
    }

    console.error('Error logged:', errorData)

    if (this.shouldReportToServer(error)) {
      this.reportToServer(errorData)
    }
  }

  private shouldReportToServer(error: Error): boolean {
    const isUndefinedError = error.message?.includes('undefined') ||
                            error.message?.includes('Cannot read')

    const isNetworkError = error.message?.includes('Network') ||
                          error.message?.includes('fetch')

    return !isNetworkError
  }

  private async reportToServer(errorData: ErrorInfo) {
    try {
      if (import.meta.env.VITE_APP_MODE === 'production') {
        await fetch('/api/errors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(errorData)
        })
      }
    } catch (err) {
      console.error('Failed to report error to server:', err)
    }
  }

  getErrors(): ErrorInfo[] {
    return [...this.errors]
  }

  clearErrors(): void {
    this.errors = []
  }

  getLastError(): ErrorInfo | null {
    return this.errors[this.errors.length - 1] || null
  }

  isUndefinedError(error: Error | string): boolean {
    const message = typeof error === 'string' ? error : error.message
    return (
      message.includes('undefined') ||
      message.includes('Cannot read') ||
      message.includes('null') ||
      message.includes('is not defined')
    )
  }

  isNetworkError(error: Error | string): boolean {
    const message = typeof error === 'string' ? error : error.message
    return (
      message.includes('Network') ||
      message.includes('fetch') ||
      message.includes('timeout') ||
      message.includes('Failed to fetch')
    )
  }
}

export const errorHandler = new ErrorHandler()

window.addEventListener('error', (event) => {
  errorHandler.logError(
    new Error(event.message),
    { componentStack: event.filename }
  )
})

window.addEventListener('unhandledrejection', (event) => {
  errorHandler.logError(
    new Error(event.reason?.message || 'Unhandled promise rejection'),
    {}
  )
})

