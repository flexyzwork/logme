'use client'

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface ThemeState {
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      (set, get) => ({
        theme: 'system',
        setTheme: (theme) => {
          set({ theme })
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          const isDark = theme === 'dark' || (theme === 'system' && prefersDark)
          document.documentElement.classList.toggle('dark', isDark)
        },
        toggleTheme: () => {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          const currentTheme = get().theme
          const newTheme =
            currentTheme === 'dark'
              ? 'light'
              : currentTheme === 'light'
                ? 'dark'
                : prefersDark
                  ? 'light'
                  : 'dark'
          set({ theme: newTheme })
          const isDark = newTheme === 'dark' // || (newTheme === 'system' && prefersDark)

          document.documentElement.classList.toggle('dark', isDark)
        },
      }),
      { name: 'theme-storage' }
    ),
    { name: 'theme-storage' }
  )
)
