import { Logger } from '@/shared/lib/logger/Logger'
import { ClientBetterStackStrategy } from '@/shared/lib/logger/strategies/impl/BetterStack'
import { ClientSentryStrategy } from '@/shared/lib/logger/strategies/impl/Sentry'
import { ClientSlackStrategy } from '@/shared/lib/logger/strategies/impl/Slack'

const strategies = []

const isBetterStackEnabled = process.env.NEXT_PUBLIC_ENABLE_BETTERSTACK === 'true'
const isSentryEnabled = process.env.NEXT_PUBLIC_ENABLE_SENTRY === 'true'
const isSlackEnabled = process.env.NEXT_PUBLIC_ENABLE_SLACK === 'true'

if (process.env.NODE_ENV === 'production') {
  if (isBetterStackEnabled) strategies.push(new ClientBetterStackStrategy())
  if (isSentryEnabled) strategies.push(new ClientSentryStrategy())
  if (isSlackEnabled) strategies.push(new ClientSlackStrategy())
}

export const clientLogger = new Logger(strategies)
