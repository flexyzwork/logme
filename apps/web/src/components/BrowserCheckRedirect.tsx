'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const isUnsafeInApp = () => {
  const ua = navigator.userAgent.toLowerCase()
  const isIOS = /iphone|ipad|ipod/.test(ua)
  const isInAppBrowser = /(kakao|naver|instagram|facebook|line|youtube|inapp|wv)/.test(ua)
  const forceBlockedOnIOS = isIOS && /(youtube)/.test(ua)

  return (isInAppBrowser && !isIOS) || forceBlockedOnIOS
}

export default function BrowserCheckRedirect() {
  const router = useRouter()

  useEffect(() => {
    if (isUnsafeInApp()) {
      router.replace('/open-in-browser')
    }
  }, [])

  return null
}
