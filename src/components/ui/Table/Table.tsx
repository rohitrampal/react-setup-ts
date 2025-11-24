import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableProps as MuiTableProps,
  Paper
} from '@mui/material'
import { ReactNode } from 'react'
import { classNames } from '@/utils/classNames'

export interface Column<T = unknown> {
  id: string
  label: string
  minWidth?: number
  align?: 'left' | 'right' | 'center'
  format?: (value: unknown, row: T) => ReactNode
  'aria-label'?: string
}

export interface TableProps<T = unknown> extends Omit<MuiTableProps, 'children'> {
  columns: Column<T>[]
  rows: T[]
  getRowId?: (row: T) => string | number
  stickyHeader?: boolean
  'aria-label'?: string
}

export function Table<T extends Record<string, unknown>>({
  columns,
  rows,
  getRowId,
  stickyHeader = false,
  className,
  'aria-label': ariaLabel,
  ...props
}: TableProps<T>) {
  const getValue = (row: T, columnId: string): unknown => {
    return row[columnId]
  }

  return (
    <TableContainer component={Paper} className="tw-shadow-md tw-rounded-lg">
      <MuiTable
        stickyHeader={stickyHeader}
        className={classNames('tw-min-w-full', className)}
        aria-label={ariaLabel || 'Data table'}
        role="table"
        {...props}
      >
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
                aria-label={column['aria-label'] || column.label}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => {
            const rowId = getRowId ? getRowId(row) : index
            return (
              <TableRow
                key={rowId}
                hover
                role="row"
                tabIndex={-1}
                aria-rowindex={index + 2}
              >
                {columns.map((column) => {
                  const value = getValue(row, column.id)
                  return (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      aria-label={`${column.label}: ${value}`}
                    >
                      {column.format ? column.format(value, row) : String(value ?? '')}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </MuiTable>
    </TableContainer>
  )
}

