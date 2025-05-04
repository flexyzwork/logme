'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import logger from '@/lib/logger'

export const isUnsafeInApp = () => {
  const ua = navigator.userAgent.toLowerCase()
  const isIOS = /iphone|ipad|ipod/.test(ua)
  const isInAppBrowser = /(kakaotalk|naver|instagram|facebook|line|youtube|inapp|wv)/.test(ua)

  return isInAppBrowser && !isIOS
}

export default function BrowserCheckRedirect() {
  const router = useRouter()
  logger.log('info', 'platform check:', { ua: navigator.userAgent, result: isUnsafeInApp() })

  useEffect(() => {
    if (isUnsafeInApp()) {
      router.replace('/open-in-browser')
    }
  }, [])

  return null
}
