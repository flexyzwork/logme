import { ClientBaseAPIStrategy } from '@/shared/lib/logger/strategies/ClientBaseAPIStrategy'

export class ClientBetterStackStrategy extends ClientBaseAPIStrategy {
  protected target = 'betterstack'
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger, withBetterStack, BetterStackRequest } from '@logtail/next'
import { LoggerStrategy, LogLevel } from '@/shared/lib/logger/strategies/LoggerStrategy'

export class ServerBetterStackStrategy implements LoggerStrategy {
  private logger: Logger

  constructor() {
    this.logger = new Logger()
  }
  shouldLog(): boolean {
    return true
  }
  async log(level: LogLevel, message: string, meta?: Record<string, any>) {
    this.logger[level](message, meta)
    await this.logger.flush()
  }

  withLogging(handler: (req: BetterStackRequest) => any) {
    return withBetterStack(handler)
  }
}
