/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClientBetterStackStrategy } from '@/lib/logger/strategies/better-stack/ClientBetterStackStrategy'
import { ServerBetterStackStrategy } from '@/lib/logger/strategies/better-stack/ServerBetterStackStrategy'
import { ClientSentryStrategy } from '@/lib/logger/strategies/sentry/ClientSentryStrategy'
import { ServerSentryStrategy } from '@/lib/logger/strategies/sentry/ServerSentryStrategy'
import { ClientSlackStrategy } from '@/lib/logger/strategies/slack/ClientSlackStrategy'
import { ServerSlackStrategy } from '@/lib/logger/strategies/slack/ServerSlackStrategy'
import { LoggerStrategy, LogLevel } from '@/lib/logger/strategies/LoggerStrategy'

class Logger {
  private strategies: LoggerStrategy[] = []

  constructor() {
    if (typeof window === 'undefined') {
      this.strategies.push(new ServerBetterStackStrategy())
      this.strategies.push(new ServerSlackStrategy())
      this.strategies.push(new ServerSentryStrategy())
    } else {
      this.strategies.push(new ClientBetterStackStrategy())
      this.strategies.push(new ClientSlackStrategy())
      this.strategies.push(new ClientSentryStrategy())
    }
  }

  async log(level: LogLevel, message: string, meta?: Record<string, any>, forceSlack = false) {
    if (process.env.NODE_ENV !== 'production') {
      console[level](
        `[${level.toUpperCase()}] ${message}`,
        meta ? JSON.stringify(meta, null, 2) : ''
      )
      // return
    }

    for (const strategy of this.strategies) {
      try {
        await strategy.log(level, message, meta, forceSlack)
      } catch (error) {
        console.warn('로깅 전략 실행 중 예외 발생', { error })
      }
    }
  }
}

const logger = new Logger()
export default logger
