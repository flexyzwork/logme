/* eslint-disable @typescript-eslint/no-explicit-any */

import { ServerBetterStackStrategy } from '@/shared/lib/logger/strategies/impl/BetterStack'
import { ServerSentryStrategy } from '@/shared/lib/logger/strategies/impl/Sentry'
import { ServerSlackStrategy } from '@/shared/lib/logger/strategies/impl/Slack'
import { LogLevel } from '@/shared/lib/logger/strategies/LoggerStrategy'

const strategyMap = {
  slack: new ServerSlackStrategy(),
  sentry: new ServerSentryStrategy(),
  betterstack: new ServerBetterStackStrategy(),
}

export async function POST(req: Request) {
  const {
    target,
    type,
    message,
    meta,
    forceSlack,
  }: {
    target: keyof typeof strategyMap
    type: LogLevel
    message: string
    meta: any
    forceSlack: boolean
  } = await req.json()

  const strategy = strategyMap[target]
  if (!strategy) {
    return new Response('Invalid target', { status: 400 })
  }

  if (!['info', 'warn', 'error'].includes(type)) {
    return new Response('Invalid log level', { status: 400 })
  }
  await strategy.log(type as LogLevel, message, meta, forceSlack)
  return new Response('ok')
}
