'use client'

import GithubButton from '@/components/logme/GithubButton'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { GuideDialogTriggerButton } from '@/components/logme/GuideDialogTriggerButton'

export default function Home() {
  const notionConnected = false // Replace with actual logic or state
  const githubConnected = false // Replace with actual logic or state
  const vercelConnected = false // Replace with actual logic or state

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
          <GuideDialogTriggerButton />
          <div className="mt-2 flex flex-nowrap justify-center gap-1 overflow-x-auto">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={notionConnected ? 'default' : 'outline'} size="sm">
                    {notionConnected && <Check className="w-4 h-4 mr-1" />} Notion
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs max-w-[200px]">
                    Notion 페이지를 가져오기 위해 연결이 필요합니다. 읽기 및 생성 권한을 요청합니다.
                  </p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={githubConnected ? 'default' : 'outline'} size="sm">
                    {githubConnected && <Check className="w-4 h-4 mr-1" />} GitHub
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs max-w-[200px]">
                    블로그 코드를 저장할 비공개 저장소를 만들기 위해 필요합니다.
                  </p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={vercelConnected ? 'default' : 'outline'} size="sm">
                    {vercelConnected && <Check className="w-4 h-4 mr-1" />} Vercel
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs max-w-[200px]">
                    완성된 블로그를 자동으로 배포하기 위해 필요합니다.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Arrow */}
        <ArrowRight className="hidden md:block w-8 h-8 text-muted-foreground" />

        {/* Step 2 */}
        <div className="flex flex-col items-center text-center w-56">
          <div className="bg-black text-white rounded-full w-14 h-14 flex items-center justify-center text-xl font-semibold shadow">
            2
          </div>
          <h3 className="mt-4 text-xl font-bold">디자인 & 설정</h3>
          <p className="text-sm text-muted-foreground mt-1">템플릿 고르고 도메인 설정</p>
          <GithubButton text="빌더 시작" stateType="github:builder:" />
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
          <Button variant="ghost" size="sm" className="mt-2"></Button>
        </div>
      </div>
    </main>
  )
}
