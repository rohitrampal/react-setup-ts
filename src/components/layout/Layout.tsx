import { Box } from '@mui/material'
import { Header } from './Header'
import { Navigation } from './Navigation'
import { useAuth } from '@/modules/auth'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated } = useAuth()

  return (
    <Box className="tw-min-h-screen tw-flex tw-flex-col">
      <Header />
      <Box className="tw-flex tw-flex-1">
        {isAuthenticated && <Navigation />}
        <Box
          component="main"
          className="tw-flex-1 tw-p-6"
          role="main"
          aria-label="Main content"
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}

