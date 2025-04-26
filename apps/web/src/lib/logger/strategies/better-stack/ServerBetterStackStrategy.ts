/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger } from '@logtail/next'
import { withBetterStack, BetterStackRequest } from '@logtail/next'
import { LoggerStrategy, LogLevel } from '@/lib/logger/strategies/LoggerStrategy'

export class ServerBetterStackStrategy implements LoggerStrategy {
  private logger: Logger

  constructor() {
    this.logger = new Logger()
  }

  async log(level: LogLevel, message: string, meta?: Record<string, any>) {
    this.logger[level](message, meta)
    await this.logger.flush()
  }

  withLogging(handler: (req: BetterStackRequest) => any) {
    return withBetterStack(handler)
  }
}
