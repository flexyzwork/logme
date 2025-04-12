import { NextResponse } from 'next/server'
import { db } from '@repo/db'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    // console.log('🔹 data:', data)
    const deployment = await db.deployment.create({
      data: {
        ...data,
      },
    })
    return NextResponse.json(deployment)
  } catch (err) {
    console.error('❌ 배포 생성 실패:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
