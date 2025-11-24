import { Container } from '@mui/material'
import { ProfileForm } from '../components/ProfileForm'
import { useAuth } from '@/modules/auth'

export const ProfilePage = () => {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <Container maxWidth='md' className='tw-py-8' aria-label='Profile page'>
      <ProfileForm />
    </Container>
  )
}
