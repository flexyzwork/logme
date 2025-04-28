'use client'

import logger from '@/lib/logger'

// export default async function ClientComponent() {
//   console.log('🟢 Client Component Logging')
//   await logger.log('error', '클라이언트 컴포넌트 로깅', { userId: 42 })
//   console.log('🟢 Client Component Logging Done')
//   return <h1>Logged in</h1>
// }

export default function ClientComponent() {
  console.log('🟢 Client Component Logging')
  logger.log('error', '클라이언트 컴포넌트 로깅', { userId: 42 })
  console.log('🟢 Client Component Logging Done')
  return <h1>Logged in</h1>
}
