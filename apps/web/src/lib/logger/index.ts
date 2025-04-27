import { serverLogger } from './serverLogger'
import { clientLogger } from './clientLogger'

const isServer = typeof window === 'undefined' && process.env.NEXT_PUBLIC_BASE_URL === undefined

export const logger = isServer ? serverLogger : clientLogger
export default logger
