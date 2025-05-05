import { NextResponse } from 'next/server'
import logger from '@/lib/logger'

export async function GET() {
  logger.log('error', 'User accessed profile', { userId: '12345' })

  return NextResponse.json({ status: 'ok' })
}