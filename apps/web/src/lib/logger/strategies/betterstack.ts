/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { Logtail } from '@logtail/node'
import { LoggerStrategy, LogLevel } from '@/lib/logger/strategies/LoggerStrategy'

let logtail: Logtail | null = null

export class BetterStackStrategy implements LoggerStrategy {
  constructor() {
    if (!logtail) {
      logtail = new Logtail(process.env.BETTERSTACK_TOKEN || '')
    }
  }

  async log(level: LogLevel, message: string, meta?: Record<string, any>) {
    try {
      await axios.post(
        'https://in.logs.betterstack.com',
        { level, message, meta },
        {
          headers: {
            Authorization: `Bearer ${process.env.BETTERSTACK_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (err) {
      console.error('BetterStack 전송 실패', err)
    }
  }
}
