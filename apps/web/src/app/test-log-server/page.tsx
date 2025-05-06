export const dynamic = 'force-dynamic'
import logger from '@/shared/lib/logger'

export default function ServerComponent() {
  logger.log('error', 'Server component logging', { userId: 42 })
  return <h1>Logged in</h1>
}
