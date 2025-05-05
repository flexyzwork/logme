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
import logger from '@/lib/logger'
import { cn } from '@/lib/utils'

export default function SiteBuilder() {
  const { isDeploying } = useSiteBuilderUI()
  const { step, notionPageId } = useBuilderStore()

  const { data: encryptedVercelTokenData } = useFetchProviderExtended('vercel', 'token')
  const { data: logmeInstallationIdData } = useFetchProviderExtended(
    'github',
    'logmeInstallationId'
  )
  const { data: vercelInstallation } = useFetchProviderExtended('github', 'vercelInstallation')

  const [shouldRedirectToAccount, setShouldRedirectToAccount] = useState(false)
  const router = useRouter()

useEffect(() => {
  const isAllResolved =
    encryptedVercelTokenData !== undefined &&
    logmeInstallationIdData !== undefined &&
    vercelInstallation !== undefined

  if (!isAllResolved) return

  const isVercelConnected = !!encryptedVercelTokenData
  const isGithubLogmeInstalled = !!logmeInstallationIdData
  const isGithubVercelInstalled = !!vercelInstallation

  if (!isVercelConnected || !isGithubLogmeInstalled || !isGithubVercelInstalled) {
    setShouldRedirectToAccount(true)
  }
}, [encryptedVercelTokenData, logmeInstallationIdData, vercelInstallation])

  useEffect(() => {
    if (shouldRedirectToAccount) {
      toast('Connection required', {
        description: 'Please link your accounts first. Redirecting to Account Settings...',
      })

      const timeout = setTimeout(() => {
        router.push('/account')
      }, 2000)

      return () => clearTimeout(timeout)
    }
  }, [shouldRedirectToAccount, router])
  logger.log('info', '📌 Current onboarding step:', { step })

  if (step === undefined || step === null) return null

  const stepTitleMap: Record<number, string | ((isDeploying: boolean) => string)> = {
    0: 'Select a template',
    1: 'Share your template',
    2: 'Enter site information',
    3: (deploying) => (deploying ? 'Deploying...' : 'Deploy to Vercel'),
    4: 'Deployment complete',
  }

  const stepTitle =
    typeof stepTitleMap[step] === 'function'
      ? (stepTitleMap[step] as (d: boolean) => string)(isDeploying)
      : (stepTitleMap[step] ?? '')

  const stepWidthMap: Record<number, string> = {
    0: 'max-w-3xl',
    1: 'max-w-lg',
    2: 'max-w-lg',
    3: 'max-w-lg',
    4: 'max-w-lg',
  }
  return (
    <>
      {shouldRedirectToAccount && (
        <div className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-lg text-center text-sm text-muted-foreground flex flex-col items-center gap-3">
            <p>Checking account connection status...</p>
          </div>
        </div>
      )}
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className={cn('w-full p-6 shadow-lg', stepWidthMap[step])}>
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
