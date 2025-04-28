import { ClientBaseAPIStrategy } from '@/lib/logger/strategies/ClientBaseAPIStrategy'
import { LogLevel } from '@/lib/logger/strategies/LoggerStrategy'

export class ClientSlackStrategy extends ClientBaseAPIStrategy {
  protected target = 'slack'

  shouldLog(level: LogLevel, forceSlack = false): boolean {
    return forceSlack || level === 'error'
  }
}
