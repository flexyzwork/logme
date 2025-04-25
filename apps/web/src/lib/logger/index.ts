/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerStrategy, LogLevel } from '@/lib/logger/strategies/LoggerStrategy'
import { SentryStrategy } from './strategies/sentry'
import { ServerSlackStrategy } from './strategies/slack/serverSlackStrategy'
import { ClientSlackStrategy } from '@/lib/logger/strategies/slack/clientSlackStrategy'

class Logger {
  private strategies: LoggerStrategy[] = []

  constructor() {
    // 공통 (Sentry는 양쪽에서 동작)
    this.strategies.push(new SentryStrategy())

    if (typeof window === 'undefined') {
      // 서버 전용
      this.strategies.push(new ServerSlackStrategy())
    } else {
      // 클라이언트 전용
      this.strategies.push(new ClientSlackStrategy())
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
      } catch (e) {
        console.warn('로깅 전략 실행 중 예외 발생', { e })
      }
    }
  }
}

const logger = new Logger()
export default logger
