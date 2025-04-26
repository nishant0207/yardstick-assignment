// lib/theme.ts
export type Theme = 'light' | 'dark'
const STORAGE_KEY = 'theme'
const PREFERENCE_KEY = 'theme-preference'

export function getInitialTheme(): Theme {
  // SSR safe
  if (typeof window === 'undefined') return 'light'
  
  // 1. Stored user theme
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
  if (stored) return stored
  
  // 2. OS preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  
  // 3. Default
  return 'light'
}

export function applyTheme(theme: Theme) {
  // Update DOM
  const html = document.documentElement
  const colorScheme = theme === 'dark' ? 'dark' : 'light'
  
  // Update classes
  if (theme === 'dark') {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
  
  // Set meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor) {
    metaThemeColor.setAttribute(
      'content', 
      theme === 'dark' ? '#111827' : '#f3f4f6'
    )
  }
  
  // Store preference
  localStorage.setItem(STORAGE_KEY, theme)
  
  // Apply CSS variables for smooth transitions
  document.documentElement.style.setProperty(
    '--color-background', 
    theme === 'dark' ? '#111827' : '#f3f4f6'
  )
  document.documentElement.style.setProperty(
    '--color-foreground', 
    theme === 'dark' ? '#f3f4f6' : '#111827'
  )
  
  // For toast notifications
  document.documentElement.style.setProperty(
    '--toast-bg', 
    theme === 'dark' ? '#374151' : '#ffffff'
  )
  document.documentElement.style.setProperty(
    '--toast-color', 
    theme === 'dark' ? '#f3f4f6' : '#111827'
  )
}