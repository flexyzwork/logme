import { ClientBaseAPIStrategy } from '@/shared/lib/logger/strategies/ClientBaseAPIStrategy'
import { LogLevel } from '@/shared/lib/logger/strategies/LoggerStrategy'

export class ClientSentryStrategy extends ClientBaseAPIStrategy {
  protected target = 'sentry'

  shouldLog(level: LogLevel): boolean {
    return level === 'error'
  }
}
