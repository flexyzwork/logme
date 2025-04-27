import { serverLogger } from './serverLogger'
import { clientLogger } from './clientLogger'

// export const logger = typeof window === 'undefined' ? serverLogger : clientLogger

export const logger2 = serverLogger
export const logger = clientLogger
export default logger
