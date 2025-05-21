import { Metadata } from 'next'
import { generateSeoMetadata } from '@/shared/utils/seo'

// 메타데이터 생성
export const metadata: Metadata = generateSeoMetadata({
  title: '블로그 생성하기',
  description: 'Notion, GitHub, Vercel 계정을 연결하고 몇 번의 클릭만으로 나만의 블로그를 만들어보세요.',
  path: '/logme',
  keywords: ['notion', 'blog', 'logme', '노션', '블로그', '생성', '자동화', '웹사이트'],
})
