import { NextResponse } from 'next/server'
import { sendBetterStackLog } from '@/lib/logger/sendBetterStackLog'

export async function GET() {
  await sendBetterStackLog('info', '🟢 BetterStack 테스트 로그', { test: true, timestamp: new Date().toISOString() })
  return NextResponse.json({ status: 'success', message: 'BetterStack로 로그 전송 완료' })
}