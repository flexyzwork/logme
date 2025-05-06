/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

export function GATracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!window.gtag) return
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
      page_path: pathname,
    })
  }, [pathname])

  return null
}
