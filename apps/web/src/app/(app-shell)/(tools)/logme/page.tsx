'use client'

import { useBuilderStore } from '@/modules/logme/features/site/stores/builderStore'
import { Button } from '@/shared/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import AdSense from '@/shared/components/ads/AdSense'
import { Metadata } from 'next'
import { generateSeoMetadata } from '@/shared/utils/seo'

// 메타데이터 생성
export const metadata: Metadata = generateSeoMetadata({
  title: '블로그 생성하기',
  description: 'Notion, GitHub, Vercel 계정을 연결하고 뮇 번의 클릭만으로 나만의 블로그를 만들어보세요.',
  path: '/logme',
  keywords: ['notion', 'blog', 'logme', '노션', '블로그', '생성', '자동화', '웹사이트'],
})

export default function Home() {
  const { setBuilderStep } = useBuilderStore()
  const router = useRouter()

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
      {/* 페이지 상단 광고 */}
      <div className="w-full max-w-4xl mb-8">
        <AdSense
          slot="4567890123"
          format="horizontal"
          className="py-4 flex justify-center"
          style={{ minHeight: "90px" }}
        />
      </div>
      <p className="text-lg text-gray-600 max-w-xl mb-12 text-center"></p>
      <div className="flex flex-col md:flex-row items-center justify-center gap-20 md:gap-12 lg:gap-16 w-full max-w-6xl px-4 py-16">
        {/* Step 1 */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-black text-white rounded-full w-14 h-14 flex items-center justify-center text-xl font-semibold shadow">
            1
          </div>
          <h3 className="mt-4 text-xl font-bold">Connect Accounts</h3>
          <p className="text-sm text-muted-foreground mt-1">Link Notion, GitHub, and Vercel</p>
          <Button className="mt-2" size="sm" onClick={() => router.push('/account')}>
            Connect
          </Button>
        </div>

        {/* Arrow */}
        <ArrowRight className="hidden md:block w-8 h-8 text-muted-foreground" />

        {/* Step 2 */}
        <div className="flex flex-col items-center text-center w-56">
          <div className="bg-black text-white rounded-full w-14 h-14 flex items-center justify-center text-xl font-semibold shadow">
            2
          </div>
          <h3 className="mt-4 text-xl font-bold">Design & Settings</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Choose a template and configure your blog
          </p>
          {/* <GithubButton text="빌더 시작" stateType="github:builder:" /> */}
          <Button
            className="mt-2"
            size="sm"
            onClick={() => {
              setBuilderStep(0)
              router.push('/logme/builder')
            }}
          >
            Get Started
          </Button>
        </div>

        {/* Arrow */}
        <ArrowRight className="hidden md:block w-8 h-8 text-muted-foreground" />

        {/* Step 3 */}
        <div className="flex flex-col items-center text-center w-56">
          <div className="bg-black text-white rounded-full w-14 h-14 flex items-center justify-center text-xl font-semibold shadow">
            3
          </div>
          <h3 className="mt-4 text-xl font-bold">Blog Complete</h3>
          <p className="text-sm text-muted-foreground mt-1">Auto-deployed and easy to update</p>
          <Button className="mt-2" size="sm" onClick={() => router.push('/dashboard')}>
            Dashboard
          </Button>
        </div>
      </div>
      
      {/* 페이지 하단 광고 */}
      <div className="w-full max-w-4xl mt-8">
        <AdSense
          slot="5678901234"
          format="rectangle"
          className="py-4 flex justify-center"
          style={{ minHeight: "250px", minWidth: "300px" }}
        />
      </div>
    </main>
  )
}
