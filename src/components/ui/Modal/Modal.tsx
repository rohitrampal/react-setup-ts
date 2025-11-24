import {
  Dialog,
  DialogProps,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { ReactNode } from 'react'
import { classNames } from '@/utils/classNames'

export interface ModalProps extends Omit<DialogProps, 'title'> {
  title?: string
  children: ReactNode
  actions?: ReactNode
  onClose: () => void
  closeButton?: boolean
  'aria-labelledby'?: string
  'aria-describedby'?: string
}

export const Modal = ({
  title,
  children,
  actions,
  onClose,
  closeButton = true,
  open,
  className,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ...props
}: ModalProps) => {
  const titleId = title ? 'modal-title' : undefined
  const descriptionId = 'modal-description'

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={ariaLabelledBy || titleId}
      aria-describedby={ariaDescribedBy || descriptionId}
      className={classNames('tw-rounded-lg', className)}
      {...props}
    >
      {title && (
        <DialogTitle id={titleId} className='tw-flex tw-items-center tw-justify-between tw-pr-4'>
          <Typography variant='h6' component='span'>
            {title}
          </Typography>
          {closeButton && (
            <IconButton
              onClick={onClose}
              aria-label='Close modal'
              className='tw-ml-auto'
              size='small'
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
      )}
      <DialogContent id={descriptionId} className='tw-py-4' aria-describedby={descriptionId}>
        {children}
      </DialogContent>
      {actions && <DialogActions className='tw-px-6 tw-pb-4'>{actions}</DialogActions>}
    </Dialog>
  )
}
