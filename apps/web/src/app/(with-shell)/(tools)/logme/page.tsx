'use client'

import { Button } from '@/components/ui/button'
import { useBuilderStore } from '@/stores/logme/builderStore'
import { ArrowRight, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { setBuilderStep } = useBuilderStore()
  const router = useRouter()

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
      <p className="text-lg text-gray-600 max-w-xl mb-12 text-center"></p>
      <div className="flex flex-col md:flex-row items-center justify-center gap-20 md:gap-12 lg:gap-16 w-full max-w-6xl px-4 py-16">
        {/* Step 1 */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-black text-white rounded-full w-14 h-14 flex items-center justify-center text-xl font-semibold shadow">
            1
          </div>
          <h3 className="mt-4 text-xl font-bold">계정 연결</h3>
          <p className="text-sm text-muted-foreground mt-1">Notion, GitHub, Vercel 연동</p>
          <Button className="mt-2" size="sm" onClick={() => router.push('/account')}>
            연결하기
          </Button>
        </div>

        {/* Arrow */}
        <ArrowRight className="hidden md:block w-8 h-8 text-muted-foreground" />

        {/* Step 2 */}
        <div className="flex flex-col items-center text-center w-56">
          <div className="bg-black text-white rounded-full w-14 h-14 flex items-center justify-center text-xl font-semibold shadow">
            2
          </div>
          <h3 className="mt-4 text-xl font-bold">디자인 & 설정</h3>
          <p className="text-sm text-muted-foreground mt-1">템플릿 고르고 블로그 설정</p>
          {/* <GithubButton text="빌더 시작" stateType="github:builder:" /> */}
          <Button
            className="mt-2"
            size="sm"
            onClick={() => {
              setBuilderStep(0)
              router.push('/logme/builder')
            }}
          >
            시작하기
          </Button>
        </div>

        {/* Arrow */}
        <ArrowRight className="hidden md:block w-8 h-8 text-muted-foreground" />

        {/* Step 3 */}
        <div className="flex flex-col items-center text-center w-56">
          <div className="bg-black text-white rounded-full w-14 h-14 flex items-center justify-center text-xl font-semibold shadow">
            3
          </div>
          <h3 className="mt-4 text-xl font-bold">블로그 완성</h3>
          <p className="text-sm text-muted-foreground mt-1">자동 배포로 끝! 수정도 쉬워요</p>
          <Button className="mt-2" size="sm" onClick={() => router.push('/dashboard')}>
            대시보드
          </Button>
        </div>
      </div>
    </main>
  )
}
