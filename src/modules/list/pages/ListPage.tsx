import { Container } from '@mui/material'
import { DataList } from '../components/DataList'

export const ListPage = () => {
  return (
    <Container maxWidth="xl" className="tw-py-8" aria-label="List page">
      <DataList />
    </Container>
  )
}

