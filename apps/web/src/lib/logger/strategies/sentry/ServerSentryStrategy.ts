/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerStrategy, LogLevel } from '@/lib/logger/strategies/LoggerStrategy'
import * as Sentry from '@sentry/nextjs'

export class ServerSentryStrategy implements LoggerStrategy {
  async log(level: LogLevel, message: string, meta?: Record<string, any>) {
    if (level === 'error') {
      Sentry.captureException(new Error(message), { extra: meta })
    }
  }
}
