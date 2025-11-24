import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { Dashboard, List as ListIcon, Person } from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface NavItem {
  labelKey: string
  path: string
  icon: React.ReactNode
  'aria-label'?: string
}

export const Navigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  const navItems: NavItem[] = [
    { labelKey: 'navigation.dashboard', path: '/dashboard', icon: <Dashboard /> },
    { labelKey: 'navigation.list', path: '/list', icon: <ListIcon /> },
    { labelKey: 'navigation.profile', path: '/profile', icon: <Person /> },
  ]

  return (
    <Drawer
      variant='permanent'
      className='tw-w-64'
      PaperProps={{
        className: 'tw-w-64 tw-relative tw-z-0',
      }}
      aria-label={t('navigation.dashboard')}
    >
      <List className='tw-mt-16' role='navigation' aria-label={t('navigation.dashboard')}>
        {navItems.map(item => {
          const isActive = location.pathname === item.path
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={isActive}
                onClick={() => navigate(item.path)}
                aria-label={t(item.labelKey)}
                aria-current={isActive ? 'page' : undefined}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={t(item.labelKey)} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Drawer>
  )
}
