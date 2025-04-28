import { Logger } from '@/lib/logger/Logger'
import { ClientBetterStackStrategy } from '@/lib/logger/strategies/better-stack/ClientBetterStackStrategy'
import { ClientSentryStrategy } from '@/lib/logger/strategies/sentry/ClientSentryStrategy'
import { ClientSlackStrategy } from '@/lib/logger/strategies/slack/ClientSlackStrategy'

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
