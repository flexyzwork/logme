import { sendAlert } from '@/lib/server/alert'

export async function POST(req: Request) {
  const { type, message, meta } = await req.json()
  await sendAlert({ type, message, meta })
  return new Response('ok')
}
