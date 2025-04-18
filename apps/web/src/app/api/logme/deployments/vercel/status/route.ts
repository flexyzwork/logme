import { NextRequest, NextResponse } from 'next/server'

const VERCEL_API_BASE_URL = 'https://api.vercel.com'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const deploymentId = searchParams.get('deploymentId')
  const vercelToken = searchParams.get('vercelToken')

  console.log('🚀 GET /api/logme/deployments/vercel/status:', { deploymentId, vercelToken })

  if (!deploymentId || !vercelToken) {
    return NextResponse.json({ error: 'Missing deploymentId or token' }, { status: 400 })
  }

  const res = await fetch(`${VERCEL_API_BASE_URL}/v13/deployments/${deploymentId}`, {
    headers: {
      Authorization: `Bearer ${vercelToken}`,
    },
  })

  const data = await res.json()

  return NextResponse.json(data)
}
