/* eslint-disable @typescript-eslint/no-explicit-any */
import { SLACK_WEBHOOK_URL } from '@/shared/lib/config/server'
import { LoggerStrategy, LogLevel } from '@/shared/lib/logger/strategies/LoggerStrategy'

export class ServerSlackStrategy implements LoggerStrategy {
  shouldLog(level: LogLevel, forceSlack = false): boolean {
    return forceSlack || level === 'error'
  }
  async log(level: LogLevel, message: string, meta?: Record<string, any>, forceSlack = false) {
    if (!SLACK_WEBHOOK_URL) return

    const shouldSendSlack = forceSlack || level === 'error'
    if (!shouldSendSlack) return

    const emojiMap = {
      info: 'ℹ️',
      warn: '⚠️',
      error: '🚨',
    }

    const payload = {
      text: `${emojiMap[level] || ''} *${message}*`,
      attachments: meta ? [{ text: '```' + JSON.stringify(meta, null, 2) + '```' }] : [],
    }

    await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
