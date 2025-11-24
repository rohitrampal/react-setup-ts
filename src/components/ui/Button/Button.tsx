import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material'
import { forwardRef } from 'react'
import { classNames } from '@/utils/classNames'

export interface ButtonProps extends Omit<MuiButtonProps, 'color'> {
  variant?: 'contained' | 'outlined' | 'text'
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
  loading?: boolean
  'aria-label'?: string
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'contained',
      color = 'primary',
      size = 'medium',
      fullWidth = false,
      loading = false,
      disabled,
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    return (
      <MuiButton
        ref={ref}
        variant={variant}
        color={color}
        size={size}
        fullWidth={fullWidth}
        disabled={disabled || loading}
        className={classNames('tw-transition-all', className)}
        aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
        aria-busy={loading}
        {...props}
      >
        {loading ? 'Loading...' : children}
      </MuiButton>
    )
  }
)

Button.displayName = 'Button'

