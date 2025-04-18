import { NextResponse } from 'next/server'
import { db } from '@repo/db'

// POST /api/logme/deployTarget - 배포 프로젝트 생성
export async function POST(req: Request) {
  try {
    const data = await req.json()
    const deployTarget = await db.deployTarget.create({
      data: {
        ...data,
      },
    })
    return NextResponse.json(deployTarget)
  } catch (err) {
    console.error('❌ 배포 프로젝트 생성 실패:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// GET /api/logme/deployTarget - 내 배포 프로젝트 목록 조회
// export async function GET(req: Request) {
//   try {
//     const cookieHeader = req.headers.get('cookie') ?? undefined
//     const userId = await getUserFromSession(cookieHeader)

//     if (!userId) {
//       return NextResponse.json({ error: '세션 없음' }, { status: 401 })
//     }
//     const deployTarget = await db.deployTarget.findMany({
//       where: { siteId: }
//     })

//     return NextResponse.json(deployTarget)
//   } catch (err) {
//     console.error('❌ 배포 프로젝트 목록 불러오기 실패:', err)
//     return new NextResponse('Internal Server Error', { status: 500 })
//   }
// }
