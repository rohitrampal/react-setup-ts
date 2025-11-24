import { lazy, Suspense } from 'react'
import { Box, CircularProgress } from '@mui/material'
import type { CalendarProps } from './Calendar'

const Calendar = lazy(() =>
  import('./Calendar').then((module) => ({ default: module.Calendar }))
)

export const LazyCalendar = (props: CalendarProps) => {
  return (
    <Suspense
      fallback={
        <Box
          className="tw-flex tw-items-center tw-justify-center tw-bg-white tw-rounded-lg tw-shadow-md tw-p-4"
          style={{ minHeight: '300px' }}
        >
          <CircularProgress size={40} />
        </Box>
      }
    >
      <Calendar {...props} />
    </Suspense>
  )
}

