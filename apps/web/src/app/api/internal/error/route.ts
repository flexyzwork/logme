import { ServerSentryStrategy } from '@/lib/logger/strategies/sentry/ServerSentryStrategy'

const sentryLogger = new ServerSentryStrategy()

export async function POST(req: Request) {
  const { type, message, meta } = await req.json()
  await sentryLogger.log(type, message, meta)
  return new Response('ok')
}
