import { serverLogger } from './serverLogger'
import { clientLogger } from './clientLogger'

export const logger = typeof window === 'undefined' ? serverLogger : clientLogger
export default logger
