import { ServerSlackStrategy } from '@/lib/logger/strategies/slack/serverSlackStrategy'

const slackLogger = new ServerSlackStrategy()

export async function POST(req: Request) {
  const { type, message, meta } = await req.json()
  await slackLogger.log(type, message, meta)
  return new Response('ok')
}
