'use client'

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface ThemeState {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      (set, get) => ({
        theme: 'light',
        toggleTheme: () => {
          const newTheme = get().theme === 'light' ? 'dark' : 'light'
          set({ theme: newTheme })
          document.documentElement.classList.toggle('dark', newTheme === 'dark') // HTML에 클래스 적용
        },
      }),
      { name: 'theme-storage' },
    ),
    { name: 'theme-storage' },
  ),
)
