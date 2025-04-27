/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerStrategy, LogLevel } from './strategies/LoggerStrategy'

export class Logger {
  private strategies: LoggerStrategy[]

  constructor(strategies: LoggerStrategy[]) {
    this.strategies = strategies
  }

  async log(level: LogLevel, message: string, meta?: Record<string, any>, forceSlack = false) {
    // if (process.env.NODE_ENV !== 'production') {
    console[level](`[${level.toUpperCase()}] ${message}`, meta ? JSON.stringify(meta, null, 2) : '')
    // return
    // }
    for (const strategy of this.strategies) {
      try {
        await strategy.log(level, message, meta, forceSlack)
      } catch (error) {
        console.error(`Failed to log with strategy ${strategy.constructor.name}`, error)
      }
    }
  }
}
