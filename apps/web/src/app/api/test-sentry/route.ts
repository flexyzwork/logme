import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'

export async function GET() {
    
  Sentry.captureException(new Error('Test Error from App Router API Route'))
  return NextResponse.json({ message: 'Sentry Test Triggered (App Router)' })
}