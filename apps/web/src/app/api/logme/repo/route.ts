import { NextResponse } from 'next/server'
import { db } from '@repo/db'

// POST /api/logme/repos - 레포 생성
export async function POST(req: Request) {
  try {
    const data = await req.json()
    const repo = await db.repo.create({
      data: {
        ...data,
      },
    })
    return NextResponse.json(repo)
  } catch (err) {
    console.error('❌ 레포 생성 실패:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// GET /api/logme/repos - 내 레포 목록 조회
// export async function GET(req: Request) {
//   try {
//     const cookieHeader = req.headers.get('cookie') ?? undefined
//     const userId = await getUserFromSession(cookieHeader)

//     if (!userId) {
//       return NextResponse.json({ error: '세션 없음' }, { status: 401 })
//     }
//     const repos = await db.repo.findMany({
//       where: { userId },
//       select: {
//         id: true,
//         repoTitle: true,
//         status: true,
//         createdAt: true,
//         template: {
//           select: {
//             templateTitle: true,
//           },
//         },
//         contentSource: {
//           select: {
//             sourceUrl: true,
//           },
//         },
//         repo: {
//           select: {
//             repoName: true,
//             repoUrl: true,
//           },
//         },
//         deployTarget: {
//           select: {
//             targetName: true,
//             targetUrl: true,
//           },
//         },
//       },
//     })

//     return NextResponse.json(repos)
//   } catch (err) {
//     console.error('❌ 레포 목록 불러오기 실패:', err)
//     return new NextResponse('Internal Server Error', { status: 500 })
//   }
// }
