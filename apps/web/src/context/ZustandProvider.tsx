'use client'

import React, { useEffect, useState } from 'react'
// import { useThemeStore } from '@/stores/themeStore'

export const ZustandProvider = ({ children }: { children: React.ReactNode }) => {
  const [isHydrated, setIsHydrated] = useState(false)

  // const { theme, toggleTheme } = useThemeStore()

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) return null // Hydration이 끝나기 전까지 아무것도 렌더링하지 않음

  return <>{children}</>
}
