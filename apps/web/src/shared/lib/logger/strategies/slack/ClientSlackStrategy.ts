import { ClientBaseAPIStrategy } from '@/shared/lib/logger/strategies/ClientBaseAPIStrategy'
import { LogLevel } from '@/shared/lib/logger/strategies/LoggerStrategy'

export class ClientSlackStrategy extends ClientBaseAPIStrategy {
  protected target = 'slack'

  shouldLog(level: LogLevel, forceSlack = false): boolean {
    return forceSlack || level === 'error'
  }
}
