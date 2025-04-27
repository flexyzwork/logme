/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger, withBetterStack, BetterStackRequest } from '@logtail/next'
import { LoggerStrategy, LogLevel } from '@/lib/logger/strategies/LoggerStrategy'

export class ServerBetterStackStrategy implements LoggerStrategy {
  private logger: Logger

  constructor() {
    this.logger = new Logger()
  }

  async log(level: LogLevel, message: string, meta?: Record<string, any>) {
    console.log(
      'NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN:',
      process.env.NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN
    )
    console.log(
      'NEXT_PUBLIC_BETTER_STACK_INGESTING_URL:',
      process.env.NEXT_PUBLIC_BETTER_STACK_INGESTING_URL
    )
    console.log(level, message, meta)
    this.logger[level](message, meta)
    await this.logger.flush()
  }

  withLogging(handler: (req: BetterStackRequest) => any) {
    return withBetterStack(handler)
  }
}
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import logger from '@/lib/logger'
// import { LoggerStrategy, LogLevel } from '@/lib/logger/strategies/LoggerStrategy'

// export class ServerBetterStackStrategy implements LoggerStrategy {
//   async log(level: LogLevel, message: string, meta?: Record<string, any>) {
//     try {
//       const baseUrl = process.env.NEXT_PUBLIC_API_URL
//       if (!baseUrl) {
//         throw new Error('NEXT_PUBLIC_API_URL is not defined')
//       }

//       await fetch(`${baseUrl}/api/internal/log`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ level, message, meta }),
//       })
//     } catch ( error ) {
//       logger.log('error', '🔴 Failed to send log from client:', { error })
//     }
//   }
// }
