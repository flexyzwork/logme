/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerStrategy, LogLevel } from '@/lib/logger/strategies/LoggerStrategy'

export class ClientSlackStrategy implements LoggerStrategy {
  async log(level: LogLevel, message: string, meta?: Record<string, any>) {
    try {
      await fetch('/api/internal/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: level, message, meta }),
      })
    } catch (err) {
      console.error('🔴 Failed to send alert from client:', err)
    }
  }
}
