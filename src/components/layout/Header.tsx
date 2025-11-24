import { AppBar, Toolbar, Typography, IconButton, Box, Button } from '@mui/material'
import { Brightness4, Brightness7, Logout, Person } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/modules/auth'
import { useTheme } from '@/hooks/useTheme'
import { LanguageSwitcher } from './LanguageSwitcher'

export const Header = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const { mode, toggleTheme } = useTheme()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <AppBar position='static' className='tw-shadow-md'>
      <Toolbar className='tw-justify-between'>
        <Typography
          variant='h6'
          component='div'
          className='tw-cursor-pointer'
          onClick={() => navigate('/dashboard')}
          role='link'
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              navigate('/dashboard')
            }
          }}
          aria-label={t('navigation.dashboard')}
        >
          {t('common.appName')}
        </Typography>

        <Box className='tw-flex tw-items-center tw-gap-2'>
          {user && (
            <>
              <Button
                color='inherit'
                startIcon={<Person />}
                onClick={() => navigate('/profile')}
                aria-label='Navigate to profile'
              >
                {user.name}
              </Button>
              <IconButton color='inherit' onClick={handleLogout} aria-label={t('auth.logout')}>
                <Logout />
              </IconButton>
            </>
          )}
          <LanguageSwitcher />
          <IconButton
            color='inherit'
            onClick={toggleTheme}
            aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
          >
            {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
