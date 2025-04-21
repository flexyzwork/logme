import { NextResponse } from 'next/server'
import { db } from '@repo/db'

// POST /api/logme/contentSources - 컨텐츠 소스 생성
export async function POST(req: Request) {
  try {
    const data = await req.json()
    const contentSource = await db.contentSource.create({
      data: {
        ...data,
      },
    })
    return NextResponse.json(contentSource)
  } catch (err) {
    console.error('❌ 컨텐츠 소스 생성 실패:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
