/* eslint-disable @typescript-eslint/no-explicit-any */
export type LogLevel = 'info' | 'warn' | 'error'

export interface LoggerStrategy {
  shouldLog(level: LogLevel, forceSlack?: boolean): boolean
  log: (
    level: LogLevel,
    message: string,
    meta?: Record<string, any>,
    forceSlack?: boolean
  ) => Promise<void>
}
