/* eslint-disable @typescript-eslint/no-explicit-any */

const isDev = process.env.NODE_ENV === 'development'

export const logger = {
  info: (msg: string, meta?: Record<string, any>) => {
    if (isDev) {
      console.log(`🟢 [INFO] ${msg}`, meta || '')
    }
  },
  warn: (msg: string, meta?: Record<string, any>) => {
    console.warn(`🟡 [WARN] ${msg}`, meta || '')
  },
  error: (msg: string, meta?: Record<string, any>) => {
    console.error(`🔴 [ERROR] ${msg}`, meta || '')
    // TODO: 나중에 Sentry 등으로 전송 가능
  },
  track: (event: string, meta?: Record<string, any>) => {
    console.log(`📊 [TRACK] ${event}`, meta || '')
    // TODO: PostHog, Plausible, DB 등으로 연동 가능
  },
}
