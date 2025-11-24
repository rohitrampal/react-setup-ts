import { useTranslation } from 'react-i18next'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { Table, Column } from '@/components/ui'
import { Box, Typography, Button, CircularProgress } from '@mui/material'
import type { ListItem } from '../hooks/useListQuery'

export const InfiniteListExample = () => {
  const { t } = useTranslation()
  const {
    allItems,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError
  } = useInfiniteScroll<ListItem>({
    endpoint: '/list/items',
    pageSize: 10
  })

  const columns: Column<ListItem>[] = [
    { id: 'name', label: t('list.name'), minWidth: 150 },
    { id: 'email', label: t('list.email'), minWidth: 200 },
    { id: 'role', label: t('list.role'), minWidth: 100 },
    { id: 'status', label: t('list.status'), minWidth: 100 }
  ]

  if (isLoading) {
    return (
      <Box className="tw-flex tw-justify-center tw-items-center tw-py-8">
        <CircularProgress aria-label={t('common.loading')} />
      </Box>
    )
  }

  if (isError) {
    return <Box>{t('common.error')}</Box>
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" className="tw-mb-4">
        {t('list.users')} (Infinite Scroll)
      </Typography>

      <Table
        columns={columns as Column<unknown>[]}
        rows={(allItems || []) as unknown as Record<string, unknown>[]}
        getRowId={(row: Record<string, unknown>) => (row.id as string) || ''}
        stickyHeader
        aria-label={t('list.users')}
      />

      <Box className="tw-mt-4 tw-text-center">
        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="contained"
            aria-label="Load more"
          >
            {isFetchingNextPage ? (
              <>
                <CircularProgress size={20} className="tw-mr-2" />
                {t('common.loading')}
              </>
            ) : (
              'Load More'
            )}
          </Button>
        )}
      </Box>
    </Box>
  )
}

