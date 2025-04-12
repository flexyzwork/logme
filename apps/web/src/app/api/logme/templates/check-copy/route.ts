import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization')?.split('Bearer ')[1]
  const notionPageId = req.nextUrl.searchParams.get('notionPageId')

  if (!token || !notionPageId) {
    return NextResponse.json({ error: 'Unauthorized or missing parameters' }, { status: 401 })
  }

  try {
    const notionApiUrl = `https://api.notion.com/v1/pages/${notionPageId}`
    const response = await fetch(notionApiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
      },
    })


    if (!response.ok) {
      return NextResponse.json({ isCopied: false, status: response.status }) // 아직 복사 안 됨
    }

    return NextResponse.json({ isCopied: true }) // 템플릿 복사 완료
  } catch (error) {
    console.error('Notion API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
