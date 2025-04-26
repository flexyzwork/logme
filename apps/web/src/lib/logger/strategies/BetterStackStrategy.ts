import { Logtail } from '@logtail/node'
import { LoggerStrategy, LogLevel } from './LoggerStrategy'

export class BetterStackStrategy implements LoggerStrategy {
  private logtail: Logtail

  constructor() {
    this.logtail = new Logtail(process.env.BETTERSTACK_TOKEN || '')
  }

  async log(level: LogLevel, message: string, meta?: Record<string, any>) {
    try {
      await this.logtail.log(level, message, meta)
    } catch (error) {
      console.error('BetterStack 로깅 실패:', error)
    }
  }
}