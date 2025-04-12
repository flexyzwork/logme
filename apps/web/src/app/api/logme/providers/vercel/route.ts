import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { token } = await req.json()

  if (!token) {
    return NextResponse.json({ error: '토큰 누락' }, { status: 400 })
  }

  const res = await fetch('https://api.vercel.com/www/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Vercel 사용자 정보 조회 실패' }, { status: 401 })
  }

    const data = await res.json()
    const user = data?.user
  console.log('user', user)

  return NextResponse.json({ user })
}
