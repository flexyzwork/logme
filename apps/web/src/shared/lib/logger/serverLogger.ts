import { ServerBetterStackStrategy } from './strategies/better-stack/ServerBetterStackStrategy'
import { ServerSlackStrategy } from './strategies/slack/ServerSlackStrategy'
import { ServerSentryStrategy } from './strategies/sentry/ServerSentryStrategy'
import { Logger } from '@/shared/lib/logger/Logger'

const strategies = []

if (process.env.NODE_ENV === 'production') {
  if (process.env.ENABLE_BETTERSTACK) strategies.push(new ServerBetterStackStrategy())
  if (process.env.ENABLE_SLACK) strategies.push(new ServerSlackStrategy())
  if (process.env.ENABLE_SENTRY) strategies.push(new ServerSentryStrategy())
}

export const serverLogger = new Logger(strategies)
