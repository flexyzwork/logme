import { Logger } from '@/lib/logger/Logger'
import { ClientBetterStackStrategy } from '@/lib/logger/strategies/better-stack/ClientBetterStackStrategy'
import { ClientSentryStrategy } from '@/lib/logger/strategies/sentry/ClientSentryStrategy'
import { ClientSlackStrategy } from '@/lib/logger/strategies/slack/ClientSlackStrategy'

const strategies = []

if (process.env.NODE_ENV === 'production') {
  if (process.env.NEXT_PUBLIC_ENABLE_BETTERSTACK) strategies.push(new ClientBetterStackStrategy())
  if (process.env.NEXT_PUBLIC_ENABLE_SLACK) strategies.push(new ClientSlackStrategy())
  if (process.env.NEXT_PUBLIC_ENABLE_SENTRY) strategies.push(new ClientSentryStrategy())
}

export const clientLogger = new Logger(strategies)
