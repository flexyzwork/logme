'use client'

import { useThemeStore } from '@/shared/stores/themeStore'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
      title={theme === 'light' ? 'Dark' : 'Light'}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
