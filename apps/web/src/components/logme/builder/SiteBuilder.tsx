'use client'

import { useBuilderStore } from '@/stores/logme/builderStore'
import Step1_CheckTemplate from './steps/Step1_CheckTemplate'
import Step2_InputSiteInfo from './steps/Step2_InputSiteInfo'
import Step3_Deploy from './steps/Step3_Deploy'
import Step4_Done from './steps/Step4_Done'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSiteBuilderUI } from '@/hooks/logme/site/useSiteBuilderUI'
import Step0_SelectTemplate from '@/components/logme/builder/steps/Step0_SelectTemplate'
import { useEffect, useState } from 'react'
import { useFetchProviderExtended } from '@/hooks/logme/provider/useFetchProviderExtended'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { decrypt } from '@/lib/crypto'

export default function SiteBuilder() {
  const { isDeploying } = useSiteBuilderUI()
  const { step, notionPageId } = useBuilderStore()

  const { data: encryptedVercelTokenData } = useFetchProviderExtended('vercel', 'token')
  const vercelTokenData = decrypt(encryptedVercelTokenData ?? '')

  const { data: logmeInstallationIdData } = useFetchProviderExtended(
    'github',
    'logmeInstallationId'
  )
  const { data: vercelInstallation } = useFetchProviderExtended('github', 'vercelInstallation')

  const [shouldRedirectToAccount, setShouldRedirectToAccount] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (
      vercelTokenData !== undefined &&
      logmeInstallationIdData !== undefined &&
      vercelInstallation !== undefined
    ) {
      const isVercelConnected = !!vercelTokenData
      const isGithubLogmeInstalled = !!logmeInstallationIdData
      const isGithubVercelInstalled = !!vercelInstallation

      if (!isVercelConnected || !isGithubLogmeInstalled || !isGithubVercelInstalled) {
        setShouldRedirectToAccount(true)
      }
    }
  }, [vercelTokenData, logmeInstallationIdData, vercelInstallation])

  useEffect(() => {
    if (shouldRedirectToAccount) {
      toast('연결이 필요해요', {
        description: '계정 연동 후 다시 시작할 수 있어요. 계정 관리로 이동합니다.',
      })

      const timeout = setTimeout(() => {
        router.push('/account')
      }, 2000)

      return () => clearTimeout(timeout)
    }
  }, [shouldRedirectToAccount, router])
  console.log('📌 현재 온보딩 상태:', { step })

  if (step === undefined || step === null) return null

  const stepTitleMap: Record<number, string | ((isDeploying: boolean) => string)> = {
    0: '템플릿을 선택하세요',
    1: 'Notion 템플릿을 공유해주세요',
    2: '사이트 정보를 입력해 주세요.',
    3: (deploying) => (deploying ? '배포 중...' : 'Vercel 배포를 진행합니다.'),
    4: 'Vercel 배포가 완료되었습니다.',
  }

  const stepTitle =
    typeof stepTitleMap[step] === 'function'
      ? (stepTitleMap[step] as (d: boolean) => string)(isDeploying)
      : (stepTitleMap[step] ?? '')

  return (
    <>
      {shouldRedirectToAccount && (
        <div className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-lg text-center text-sm text-muted-foreground flex flex-col items-center gap-3">
            <p>계정 연동 정보를 확인 중입니다...</p>
          </div>
        </div>
      )}
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">{stepTitle}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {step === 0 && <Step0_SelectTemplate />}
            {step === 1 && notionPageId && <Step1_CheckTemplate notionPageId={notionPageId} />}
            {step === 2 && <Step2_InputSiteInfo />}
            {step === 3 && <Step3_Deploy />}
            {step === 4 && <Step4_Done />}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
