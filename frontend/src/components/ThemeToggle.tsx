import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../lib/theme'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-full ring-1 ring-black/10 dark:ring-white/15 bg-white/70 dark:bg-white/5 backdrop-blur-sm hover:scale-105 transition-all duration-300 group"
    >
      <Sun
        className={`absolute w-4 h-4 text-amber-500 transition-all duration-300 ${
          isDark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
        }`}
        strokeWidth={2.5}
      />
      <Moon
        className={`absolute w-4 h-4 text-yellow-300 transition-all duration-300 ${
          isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'
        }`}
        strokeWidth={2.5}
      />
    </button>
  )
}
