import { Card as MuiCard, CardProps as MuiCardProps, CardContent, CardHeader } from '@mui/material'
import { ReactNode } from 'react'
import { classNames } from '@/utils/classNames'

export interface CardProps extends MuiCardProps {
  title?: string
  subtitle?: string
  children: ReactNode
  actions?: ReactNode
  'aria-label'?: string
}

export const Card = ({
  title,
  subtitle,
  children,
  actions,
  className,
  'aria-label': ariaLabel,
  ...props
}: CardProps) => {
  return (
    <MuiCard
      className={classNames('tw-shadow-md tw-rounded-lg', className)}
      aria-label={ariaLabel}
      {...props}
    >
      {(title || subtitle || actions) && (
        <CardHeader
          title={title}
          subheader={subtitle}
          action={actions}
          aria-label={title ? `${title} card` : undefined}
        />
      )}
      <CardContent className='tw-p-6'>{children}</CardContent>
    </MuiCard>
  )
}
