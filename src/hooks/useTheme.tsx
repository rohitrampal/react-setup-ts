import { useState, useEffect, useMemo, ReactNode } from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { getTheme, ThemeMode } from '@/config/theme'

export const useTheme = () => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem('theme_mode')
    return (stored as ThemeMode) || 'light'
  })

  useEffect(() => {
    localStorage.setItem('theme_mode', mode)
  }, [mode])

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const theme = useMemo(() => getTheme(mode), [mode])

  return {
    mode,
    theme,
    toggleTheme,
    setMode
  }
}

export const ThemeWrapper = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

