import {
  List as MuiList,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  ListProps as MuiListProps,
  Divider
} from '@mui/material'
import { ReactNode } from 'react'
import { classNames } from '@/utils/classNames'

export interface ListItemData {
  id: string | number
  primary: string
  secondary?: string
  icon?: ReactNode
  onClick?: () => void
  disabled?: boolean
  'aria-label'?: string
}

export interface ListProps extends MuiListProps {
  items: ListItemData[]
  dividers?: boolean
  dense?: boolean
  'aria-label'?: string
}

export const List = ({
  items,
  dividers = false,
  dense = false,
  className,
  'aria-label': ariaLabel,
  ...props
}: ListProps) => {
  return (
    <MuiList
      dense={dense}
      className={classNames('tw-bg-white tw-rounded-lg tw-shadow-md', className)}
      aria-label={ariaLabel || 'List'}
      role="list"
      {...props}
    >
      {items.map((item, index) => (
        <div key={item.id}>
          <ListItem
            disablePadding
            disabled={item.disabled}
            aria-label={item['aria-label'] || item.primary}
          >
            {item.onClick ? (
              <ListItemButton onClick={item.onClick} disabled={item.disabled}>
                {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                <ListItemText primary={item.primary} secondary={item.secondary} />
              </ListItemButton>
            ) : (
              <>
                {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                <ListItemText primary={item.primary} secondary={item.secondary} />
              </>
            )}
          </ListItem>
          {dividers && index < items.length - 1 && <Divider />}
        </div>
      ))}
    </MuiList>
  )
}

