'use client'

import { useBuilderStore } from '@/stores/logme/builderStore'
import Step1_CheckTemplate from './steps/Step1_CheckTemplate'
import Step2_InputSiteInfo from './steps/Step2_InputSiteInfo'
import Step3_InputVercelToken from './steps/Step3_InputVercelToken'
import Step4_InstallGithubApp from './steps/Step4_InstallGithubApp'
import Step5_Deploy from './steps/Step5_Deploy'
import Step6_Done from './steps/Step6_Done'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSiteBuilderUI } from '@/hooks/logme/site/useSiteBuilderUI'
import Step0_SelectTemplate from '@/components/logme/builder/steps/Step0_SelectTemplate'

export default function SiteBuilder() {
  const { isDeploying } = useSiteBuilderUI()
  const { step, notionPageId } = useBuilderStore()

  console.log('📌 현재 온보딩 상태:', { step })

  if (step === undefined || step === null) return null

  const stepTitleMap: Record<number, string | ((isDeploying: boolean) => string)> = {
    0: '템플릿을 선택하세요',
    1: 'Notion 템플릿을 공유해주세요',
    2: '사이트 정보를 입력해 주세요.',
    3: 'Vercel 토큰을 입력해주세요',
    4: 'GitHub App을 설치해 주세요.',
    5: (deploying) => (deploying ? '배포 중...' : 'Vercel 배포를 진행합니다.'),
    6: 'Vercel 배포가 완료되었습니다.',
  }

  const stepTitle =
    typeof stepTitleMap[step] === 'function'
      ? (stepTitleMap[step] as (d: boolean) => string)(isDeploying)
      : (stepTitleMap[step] ?? '')

  return (
    <>
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">{stepTitle}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {step === 0 && <Step0_SelectTemplate />}
            {step === 1 && notionPageId && <Step1_CheckTemplate notionPageId={notionPageId} />}
            {step === 2 && <Step2_InputSiteInfo />}
            {step === 3 && <Step3_InputVercelToken />}
            {step === 4 && <Step4_InstallGithubApp />}
            {step === 5 && <Step5_Deploy />}
            {step === 6 && <Step6_Done />}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
