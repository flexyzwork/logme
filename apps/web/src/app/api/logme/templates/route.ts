import { NextResponse } from 'next/server'
import { db } from '@repo/db'
import { getAuthSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const templates = await db.template.findMany({
      select: {
        id: true,
        templateTitle: true,
        templateDescription: true,
        thumbnailUrl: true,
        templateApp: {
          select: {
            id: true,
            appClientId: true,
            appRedirectUri: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(templates)
  } catch (err) {
    console.error('❌ 템플릿 목록 불러오기 실패:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
