import { Chip as MuiChip, ChipProps as MuiChipProps } from '@mui/material'
import { forwardRef } from 'react'
import { classNames } from '@/utils/classNames'

export interface ChipProps extends MuiChipProps {
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
  variant?: 'filled' | 'outlined'
  size?: 'small' | 'medium'
  'aria-label'?: string
}

export const Chip = forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      color = 'default',
      variant = 'filled',
      size = 'medium',
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    return (
      <MuiChip
        ref={ref}
        color={color}
        variant={variant}
        size={size}
        className={classNames('tw-transition-all', className)}
        aria-label={ariaLabel || (typeof props.label === 'string' ? props.label : undefined)}
        {...props}
      />
    )
  }
)

Chip.displayName = 'Chip'
