'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { trackEvent } from '@/lib/tracking'

export function AuthTracker() {
  const { data: session, status } = useSession()
  const trackedRef = useRef(false)

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id && !trackedRef.current) {
      trackedRef.current = true

      trackEvent({
        userId: session.user.id,
        event: 'user_login_success',
      })
    }
  }, [status, session])

  return null
}
