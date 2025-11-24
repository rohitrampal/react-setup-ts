import { Container, Box } from '@mui/material'
import { LoginForm } from '../components/LoginForm'

export const LoginPage = () => {
  return (
    <Container
      maxWidth="sm"
      className="tw-min-h-screen tw-flex tw-items-center tw-justify-center"
      aria-label="Login page"
    >
      <Box className="tw-w-full">
        <LoginForm />
      </Box>
    </Container>
  )
}

