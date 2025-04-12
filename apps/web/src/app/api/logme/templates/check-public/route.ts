import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization')?.split('Bearer ')[1]
  const notionPageId = req.nextUrl.searchParams.get('notionPageId')

  if (!notionPageId) {
    return NextResponse.json({ error: 'Page ID is required' }, { status: 400 })
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
      return NextResponse.json(
        { error: 'Failed to fetch Notion page' },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log('token', token)

    console.log('data', data)
    const isPublic = !!data.public_url // 게시 여부 확인

    return NextResponse.json({ isPublic })
  } catch (error) {
    console.error('Notion API 오류:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
