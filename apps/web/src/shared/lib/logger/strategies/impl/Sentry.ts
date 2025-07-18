/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClientBaseAPIStrategy } from '@/shared/lib/logger/strategies/ClientBaseAPIStrategy'
import { LoggerStrategy, LogLevel } from '@/shared/lib/logger/strategies/LoggerStrategy'
import * as Sentry from '@sentry/nextjs'

export class ClientSentryStrategy extends ClientBaseAPIStrategy {
  protected target = 'sentry'

  shouldLog(level: LogLevel): boolean {
    return level === 'error'
  }
}

export class ServerSentryStrategy implements LoggerStrategy {
  shouldLog(level: LogLevel): boolean {
    return level === 'error'
  }
  async log(level: LogLevel, message: string, meta?: Record<string, any>) {
    if (level === 'error') {
      Sentry.captureException(new Error(message), { extra: meta })
    }
  }
}
