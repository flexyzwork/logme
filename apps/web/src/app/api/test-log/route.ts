// import { withBetterStack, BetterStackRequest } from '@logtail/next'
// import { NextResponse } from 'next/server'

// export const GET = withBetterStack((req: BetterStackRequest) => {
//   req.log.info('유저 로그인 성공', { userId: '12345' })

//   const log = req.log.with({ scope: 'user' })
//   log.info('User accessed profile', { userId: '12345' })

//   return NextResponse.json({ status: 'ok' })
// })


import { NextResponse } from 'next/server'
import logger from '@/lib/logger'

export async function GET() {
  logger.log('error', 'User accessed profile', { userId: '12345' })

  return NextResponse.json({ status: 'ok' })
}