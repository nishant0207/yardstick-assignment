// contexts/ThemeContext.tsx
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { getInitialTheme, applyTheme, Theme } from "@/lib/theme"

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {}
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme())
  const [mounted, setMounted] = useState(false)

  // Handle initial theme setting after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // whenever theme changes, apply it to <html> and persist
  useEffect(() => {
    if (mounted) {
      applyTheme(theme)
    }
  }, [theme, mounted])

  // Listen for OS theme preference changes
  useEffect(() => {
    if (!mounted) return
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light'
      // Only auto-switch if user hasn't explicitly set a preference
      if (!localStorage.getItem('theme-preference')) {
        setTheme(newTheme)
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [mounted])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme-preference', 'set') // Mark that user has set a preference
  }

  const contextValue = {
    theme, 
    toggleTheme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme)
      localStorage.setItem('theme-preference', 'set')
    }
  }

  // Avoid rendering with incorrect theme
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

// custom hook for convenience
export function useTheme() {
  return useContext(ThemeContext)
}