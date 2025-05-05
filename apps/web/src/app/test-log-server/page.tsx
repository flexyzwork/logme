export const dynamic = 'force-dynamic'
import logger from '@/lib/logger'

export default function ServerComponent() {
  console.log('🟢 Server Component Logging')
  logger.log('error', '서버 컴포넌트 로깅', { userId: 42 })
  console.log('🟢 Server Component Logging Done')
  return <h1>Logged in</h1>
}
