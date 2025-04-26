// components/ThemeToggle.tsx
"use client"

import { useTheme } from "@/contexts/ThemeContext"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      aria-label="Toggle dark/light theme"
      className="p-2 relative overflow-hidden rounded-full"
    >
      <span className="relative z-10">
        {theme === "dark" 
          ? <Sun className="w-5 h-5 text-yellow-400" /> 
          : <Moon className="w-5 h-5 text-blue-600" />
        }
      </span>
      <span className={`absolute inset-0 transition-opacity duration-300 ${
        theme === "dark" 
          ? "bg-gray-700 opacity-100" 
          : "bg-gray-200 opacity-0"
      }`}></span>
    </Button>
  )
}