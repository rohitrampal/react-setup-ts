import { lazy } from 'react'
import { Container, Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ComponentSuspense } from '@/components/lazy'
import { LazyGraph } from '@/components/ui/Graph/LazyGraph'
import type { GraphData } from '@/components/ui'

// Lazy load DashboardStats component
const DashboardStats = lazy(() =>
  import('../components/DashboardStats').then(module => ({
    default: module.DashboardStats,
  }))
)

export const DashboardPage = () => {
  const { t } = useTranslation()
  const chartData: GraphData[] = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
  ]

  return (
    <Container maxWidth='xl' className='tw-py-8' aria-label={t('dashboard.title')}>
      <Typography variant='h4' component='h1' className='tw-mb-6'>
        {t('dashboard.title')}
      </Typography>

      <ComponentSuspense>
        <DashboardStats />
      </ComponentSuspense>

      <Box className='tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6'>
        <LazyGraph
          type='line'
          data={chartData}
          title={t('dashboard.revenueOverview')}
          aria-label={t('dashboard.revenueOverview')}
        />
        <LazyGraph
          type='bar'
          data={chartData}
          title={t('dashboard.monthlySales')}
          aria-label={t('dashboard.monthlySales')}
        />
      </Box>
    </Container>
  )
}
