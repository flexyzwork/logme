import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { access_token, page_id } = await req.json()

    if (!access_token || !page_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const response = await fetch(`https://api.notion.com/v1/pages/${page_id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        properties: {
          public_url: `https://www.notion.so/${page_id.replace(/-/g, '')}`,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to publish page: ${data.message}` },
        { status: 400 },
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })
  }
}
