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

// GET /api/logme/contentSources - 내 컨텐츠 소스 목록 조회
// export async function GET(req: Request) {
//   try {
//     const cookieHeader = req.headers.get('cookie') ?? undefined
//     const userId = await getUserFromSession(cookieHeader)

//     if (!userId) {
//       return NextResponse.json({ error: '세션 없음' }, { status: 401 })
//     }
//     const contentSources = await db.contentSource.findMany({
//       where: { siteId: }
//     })

//     return NextResponse.json(contentSources)
//   } catch (err) {
//     console.error('❌ 컨텐츠 소스 목록 불러오기 실패:', err)
//     return new NextResponse('Internal Server Error', { status: 500 })
//   }
// }
