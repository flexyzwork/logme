/* eslint-disable @typescript-eslint/no-explicit-any */
import logger from '@/lib/logger'
import { LoggerStrategy, LogLevel } from '@/lib/logger/strategies/LoggerStrategy'

export class ClientSentryStrategy implements LoggerStrategy {
  async log(level: LogLevel, message: string, meta?: Record<string, any>) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL
      if (!baseUrl) {
        throw new Error('NEXT_PUBLIC_API_URL is not defined')
      }

      await fetch(`${baseUrl}/api/internal/error`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: level, message, meta }),
      })
    } catch (error) {
      logger.log('error', '🔴 Failed to send log from client:', { error })
    }
  }
}
