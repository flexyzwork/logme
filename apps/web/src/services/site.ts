'use server'

import { authConfig } from '@/lib/auth'
import { getServerSession } from 'next-auth'

export const handleGenerateSite = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  const session = await getServerSession(authConfig)
  if (!session) {
    console.error('User not authenticated')
    return
  }
  const userId = session.user.id
  const notionPageId = 'xxx'
  const siteSlug = 'my-site-slug'
  const siteTitle = 'site-title'
  const siteDescription = 'site-description'

  const newSite = await fetch(`${baseUrl}/api/site/create`, {
    method: 'POST',
    body: JSON.stringify({
      notionPageId: notionPageId,
      siteSlug: siteSlug,
      userId: userId,
      siteTitle: siteTitle,
      siteDescription: siteDescription,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const result = await newSite.json()
  if (result.ok) {
    console.log('Site created successfully:', result.siteId)
  } else {
    console.error('Error creating site:', result.error)
  }
}
