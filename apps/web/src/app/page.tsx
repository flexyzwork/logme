import { Metadata } from 'next'
import Landing from '@/modules/logme/components/landing/Landing'
import BrowserCheckRedirect from '@/shared/components/system/BrowserCheckRedirect'
import { generateSeoMetadata } from '@/shared/utils/seo'

export const metadata: Metadata = generateSeoMetadata({
  title: '홈',
  description: '당신의 Notion 페이지로 멋진 블로그나 포트폴리오, 팀 사이트를 만들어보세요. 클릭 몇 번으로 완성되는 간편한 블로그 자동화 서비스입니다.',
  path: '/',
  keywords: ['notion', 'blog', '노션', '블로그', '자동화', '웹사이트', '포트폴리오', '팀사이트'],
})

export default function LandingPage() {
  return (
    <main className="min-h-screen py-16">
      <BrowserCheckRedirect />
      <Landing />
    </main>
  )
}
