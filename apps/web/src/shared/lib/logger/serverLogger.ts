import { ServerBetterStackStrategy } from './strategies/impl/BetterStack'
import { ServerSlackStrategy } from './strategies/impl/Slack'
import { ServerSentryStrategy } from './strategies/impl/Sentry'
import { Logger } from '@/shared/lib/logger/Logger'

const strategies = []

if (process.env.NODE_ENV === 'production') {
  if (process.env.ENABLE_BETTERSTACK) strategies.push(new ServerBetterStackStrategy())
  if (process.env.ENABLE_SLACK) strategies.push(new ServerSlackStrategy())
  if (process.env.ENABLE_SENTRY) strategies.push(new ServerSentryStrategy())
}

export const serverLogger = new Logger(strategies)
