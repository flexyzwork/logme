'use client'

import logger from '@/lib/logger'

export default function ClientComponent() {
  console.log('🟢 Client Component Logging')
  logger.log('error', 'Client component logging', { userId: 42 })
  console.log('🟢 Client Component Logging Done')
  return <h1>Logged in</h1>
}
