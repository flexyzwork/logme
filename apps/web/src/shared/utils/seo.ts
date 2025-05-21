import { Metadata } from 'next'

export type SeoProps = {
  title?: string
  description?: string
  path?: string
  ogImage?: string
  type?: 'website' | 'article'
  locale?: string
  publishedTime?: string
  authors?: string[]
  keywords?: string[]
  noIndex?: boolean
}

/**
 * uac01 ud398uc774uc9c0uc5d0uc11c uc0acuc6a9ud560 SEO uba54ud0c0ub370uc774ud130ub97c uc0dduc131ud569ub2c8ub2e4.
 */
export function generateSeoMetadata({
  title,
  description = 'ub2f9uc2e0uc758 Notion ud398uc774uc9c0ub85c uba4buc9c4 ube14ub85cuadf8ub098 ud3ecud2b8ud3f4ub9acuc624, ud300 uc0acuc774ud2b8ub97c ub9ccub4e4uc5b4ubcf4uc138uc694.',
  path = '',
  ogImage,
  type = 'website',
  locale = 'ko_KR',
  publishedTime,
  authors,
  keywords,
  noIndex = false,
}: SeoProps): Metadata {
  // uae30ubcf8 uc0acuc774ud2b8 URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://logme.dev'
  const url = path ? `${baseUrl}/${path.replace(/^\//, '')}` : baseUrl
  
  // uae30ubcf8 ud0c0uc774ud2c0 uad6cuc131
  const defaultTitle = 'Logme'
  const fullTitle = title ? `${title} | ${defaultTitle}` : defaultTitle

  // OG uc774ubbf8uc9c0 URL uad6cuc131
  const defaultOgImage = `${baseUrl}/api/og?title=${encodeURIComponent(fullTitle)}`
  const finalOgImage = ogImage || defaultOgImage

  return {
    metadataBase: new URL(baseUrl),
    title: fullTitle,
    description,
    keywords,
    
    // uae30ubcf8 uba54ud0c0ub370uc774ud130
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    authors: authors?.map(author => ({ name: author })),
    
    // Open Graph uba54ud0c0ub370uc774ud130
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: 'Logme',
      locale,
      type,
      ...(publishedTime && { publishedTime }),
      images: [
        {
          url: finalOgImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    
    // Twitter uba54ud0c0ub370uc774ud130
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [finalOgImage],
    },
  }
}
