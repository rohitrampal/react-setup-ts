import { Box } from '@mui/material'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { ReactNode } from 'react'
import { classNames } from '@/utils/classNames'

export type GraphType = 'line' | 'bar' | 'pie'

export interface GraphData {
  name: string
  value: number
  [key: string]: string | number
}

export interface GraphProps {
  type: GraphType
  data: GraphData[]
  title?: string
  xAxisKey?: string
  yAxisKey?: string
  colors?: string[]
  className?: string
  'aria-label'?: string
}

const COLORS = ['#2196f3', '#9c27b0', '#4caf50', '#ff9800', '#f44336', '#00bcd4']

export const Graph = ({
  type,
  data,
  title,
  xAxisKey = 'name',
  yAxisKey = 'value',
  colors = COLORS,
  className,
  'aria-label': ariaLabel,
}: GraphProps) => {
  const renderChart = (): ReactNode => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={data} aria-label={ariaLabel || 'Line chart'}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type='monotone' dataKey={yAxisKey} stroke={colors[0]} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )

      case 'bar':
        return (
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={data} aria-label={ariaLabel || 'Bar chart'}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={yAxisKey} fill={colors[0]} />
            </BarChart>
          </ResponsiveContainer>
        )

      case 'pie':
        return (
          <ResponsiveContainer width='100%' height={300}>
            <PieChart aria-label={ariaLabel || 'Pie chart'}>
              <Pie
                data={data}
                cx='50%'
                cy='50%'
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill='#8884d8'
                dataKey={yAxisKey}
              >
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  return (
    <Box
      className={classNames('tw-bg-white tw-rounded-lg tw-shadow-md tw-p-4', className)}
      role='img'
      aria-label={ariaLabel || `${type} chart`}
    >
      {title && (
        <Box component='h3' className='tw-mb-4 tw-text-lg tw-font-semibold'>
          {title}
        </Box>
      )}
      {renderChart()}
    </Box>
  )
}
