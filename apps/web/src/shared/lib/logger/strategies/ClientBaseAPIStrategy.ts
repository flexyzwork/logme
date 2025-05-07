/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoggerStrategy, LogLevel } from '@/shared/lib/logger/strategies/LoggerStrategy'

export abstract class ClientBaseAPIStrategy implements LoggerStrategy {
  protected abstract target: string

  shouldLog(level: LogLevel, forceSlack = false): boolean {
    return true
  }

  async log(level: LogLevel, message: string, meta?: Record<string, any>, forceSlack = false) {
    try {
      const baseUrl = process.env.BASE_URL || ''
      await fetch(`${baseUrl}/api/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: this.target,
          type: level,
          message,
          meta,
          forceSlack,
        }),
      })
    } catch (error) {
      console.error('🔴 Failed to send log from client:', { error })
    }
  }
}
