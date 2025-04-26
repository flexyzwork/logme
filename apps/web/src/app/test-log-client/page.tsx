'use client'

import logger from '@/lib/logger'

export default function ClientComponent() {
  logger.log('error', '클라이언트 컴포넌트 로깅', { userId: 42 })

  return <h1>Logged in</h1>
}
