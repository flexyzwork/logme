/* eslint-disable @typescript-eslint/no-explicit-any */
import logger from '@/lib/logger'
import { LoggerStrategy, LogLevel } from '@/lib/logger/strategies/LoggerStrategy'

export class clientBetterStackStrategy implements LoggerStrategy {
  async log(level: LogLevel, message: string, meta?: Record<string, any>) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

      await fetch(`${baseUrl}/api/internal/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: level, message, meta }),
      })
    } catch ( error ) {
      logger.log('error', '🔴 Failed to send log from client:', { error })
    }
  }
}
