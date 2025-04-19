'use server'

import { getAuthSession } from '@/lib/auth'
import { logger } from '@/lib/logger'
import { getUniqueSlug } from '@/lib/utils'
import { NextResponse } from 'next/server'

export const handleGenerateSite = async (formData: FormData): Promise<void> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  const session = await getAuthSession()
  if (!session) {
    new NextResponse('Unauthorized', { status: 401 })
  }
  const userId = session?.user.id
  const notionPageId = formData.get('notionPageId') as string
  const siteSlugInput = formData.get('siteSlug') as string
  const siteTitle = formData.get('siteTitle') as string
  const siteDescription = formData.get('siteDescription') as string

  let siteSlug = siteSlugInput || 'my-site-slug'

  siteSlug = await getUniqueSlug(siteSlug)

  const newSite = await fetch(`${baseUrl}/api/logme/site/create`, {
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
  if (!newSite.ok) {
    const text = await newSite.text()
    logger.error('API Error:', {status: newSite.status, text})
    return
  }
  const result = await newSite.json()
  if (result.ok) {
    logger.info('Site created successfully:', result.siteId)
  } else {
    logger.error('Error creating site:', result.error)
  }
}
