'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackEvent } from '@/lib/tracking'
import { useSession } from 'next-auth/react'

export function PageViewTracker() {
  const pathname = usePathname()
  const { data: session } = useSession()

  useEffect(() => {
    if (!pathname.startsWith('/_next') && pathname !== '/favicon.ico') {
      trackEvent({
        userId: session?.user?.id ?? 'anonymous',
        event: 'page_view_tracked',
        meta: { pathname },
      })
    }
  }, [pathname, session?.user?.id])

  return null
}
