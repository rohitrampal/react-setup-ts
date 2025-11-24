import {
  Alert as MuiAlert,
  AlertProps as MuiAlertProps,
  AlertTitle,
  IconButton,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { ReactNode } from 'react'
import { classNames } from '@/utils/classNames'

export interface AlertProps extends Omit<MuiAlertProps, 'severity'> {
  severity?: 'error' | 'warning' | 'info' | 'success'
  title?: string
  children: ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  'aria-label'?: string
}

export const Alert = ({
  severity = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className,
  'aria-label': ariaLabel,
  ...props
}: AlertProps) => {
  return (
    <MuiAlert
      severity={severity}
      className={classNames('tw-rounded-lg tw-mb-4', className)}
      aria-label={ariaLabel || `${severity} alert`}
      role='alert'
      action={
        dismissible && onDismiss ? (
          <IconButton aria-label='Dismiss alert' color='inherit' size='small' onClick={onDismiss}>
            <CloseIcon fontSize='inherit' />
          </IconButton>
        ) : undefined
      }
      {...props}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {children}
    </MuiAlert>
  )
}
