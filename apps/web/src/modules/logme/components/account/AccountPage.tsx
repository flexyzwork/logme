'use client'

import { decrypt, encrypt } from '@/shared/lib/crypto'
import { GuideDialogTriggerButton } from '@/modules/logme/components/landing/GuideDialogTriggerButton'
import { useCreateProvider } from '@/modules/logme/features/provider/hooks/useCreateProvider'
import { useCreateProviderExtended } from '@/modules/logme/features/provider/hooks/useCreateProviderExtended'
import { useDeleteProvider } from '@/modules/logme/features/provider/hooks/useDeleteProvider'
import { useFetchProvider } from '@/modules/logme/features/provider/hooks/useFetchProvider'
import { useFetchProviderExtended } from '@/modules/logme/features/provider/hooks/useFetchProviderExtended'
import { useFetchProviderVercel } from '@/modules/logme/features/provider/hooks/useFetchProviderVercel'
import { useGithubAppInstall } from '@/modules/logme/features/provider/hooks/useGithubAppInstall'
import { Button } from '@/shared/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import ConnectionStatus from '@/modules/logme/components/account/ConnectionStatus'
import { ProviderType } from '@repo/db'

// Query key constants
const providerKeys = {
  notion: ['provider', 'notion'],
  github: ['provider', 'github'],
  githubLogme: ['providerExtended', 'github', 'logmeInstallationId'],
  githubVercel: ['providerExtended', 'github', 'vercelInstallation'],
  vercel: ['provider', 'vercel'],
  vercelToken: ['providerExtended', 'vercel', 'token'],
}

export default function AccountPage() {
  const queryClient = useQueryClient()
  const invalidateAll = async () => {
    for (const key of Object.values(providerKeys)) {
      await queryClient.invalidateQueries({ queryKey: key })
    }
    await queryClient.refetchQueries()
  }
  const [isMasked, setIsMasked] = useState(true)
  const { data: session } = useSession()
  const storeProviderUser = useCreateProvider()
  const storeProviderExtended = useCreateProviderExtended()
  const { mutateAsync: fetchUser } = useFetchProviderVercel()

  const { data: encryptedVercelTokenData } = useFetchProviderExtended('vercel', 'token')
  const vercelTokenData = encryptedVercelTokenData ? decrypt(encryptedVercelTokenData) : ''

  const { data: notionData } = useFetchProvider('notion')
  const { data: logmeInstallationIdData } = useFetchProviderExtended(
    'github',
    'logmeInstallationId'
  )
  const { data: vercelInstallation } = useFetchProviderExtended('github', 'vercelInstallation')
  const { mutate: notionDelete, isPending: notionDeletePending } = useDeleteProvider('notion', {
    onSuccess: invalidateAll,
  })
  const { mutate: githubDelete, isPending: githubDeletePending } = useDeleteProvider('github', {
    onSuccess: () => {
      invalidateAll()
      setIsLogmeAppInstalled(false)
      setInstalledVercel(false)
    },
  })
  const { mutate: vercelDelete, isPending: vercelDeletePending } = useDeleteProvider('vercel', {
    onSuccess: () => {
      invalidateAll()
      setVercelTokenInput('')
    },
  })

  const {
    handleAppInstall,
    isLogmeAppInstalled,
    installedVercel,
    setIsLogmeAppInstalled,
    setInstalledVercel,
  } = useGithubAppInstall()

  const [vercelTokenInput, setVercelTokenInput] = useState(vercelTokenData ?? '')

  useEffect(() => {
    setIsLogmeAppInstalled(!!logmeInstallationIdData)
    setInstalledVercel(!!vercelInstallation)
  }, [logmeInstallationIdData, vercelInstallation, setInstalledVercel, setIsLogmeAppInstalled])

  useEffect(() => {
    setVercelTokenInput(vercelTokenData ?? '')
  }, [vercelTokenData])

  const handleSave = async () => {
    if (!vercelTokenInput || !session?.user?.id) return

    const { user } = await fetchUser(vercelTokenInput)

    const providerUser = {
      providerType: ProviderType.vercel,
      providerUserId: String(user.uid),
      name: user.username || '',
      email: user.email || null,
      avatarUrl: user.avatar || null,
      userId: session.user.id
    }

    const providerResponse = await storeProviderUser.mutateAsync(providerUser)

    const providerExtended = {
      providerId: providerResponse.id,
      providerType: ProviderType.vercel,
      extendedKey: 'token',
      extendedValue: encrypt(vercelTokenInput),
      templateId: null
    }
    
    await storeProviderExtended.mutateAsync(providerExtended)

    await invalidateAll()

    setIsMasked(true)
  }

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
      <div className="flex items-center justify-between gap-4 py-2 px-6 bg-muted rounded-xl">
        {/* 연결 상태 표시 */}
        <div className="flex flex-wrap gap-3 items-center justify">
          {/* <ConnectionStatus provider="notion" connected={!!notionData} /> */}
          <ConnectionStatus provider="vercel" connected={!!vercelTokenData} />
          <ConnectionStatus
            provider="github"
            connected={!!logmeInstallationIdData && !!installedVercel}
          />
        </div>
        {/* 가이드 버튼 */}
        <div className="flex gap-2">
          <GuideDialogTriggerButton path="/guide/join" label="Sign Up Guide" />
          <GuideDialogTriggerButton path="/guide/connect" label="Connect Services" />
        </div>
      </div>
      <div className="bg-muted/50 border border-border rounded-xl p-4 text-sm text-muted-foreground space-y-2">
        <p>
          📝 <strong>Notion</strong> is useful for backing up or organizing your work as documents.
          You can use it as your personal writing repository.
        </p>
        <p>
          🚀 <strong>Vercel</strong> is a platform that lets you easily deploy blogs or portfolios.
        </p>
        <p>
          🔗 <strong>GitHub</strong> is needed for storing code and connecting deployments. It works
          with Vercel to publish your site.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notion</CardTitle>
        </CardHeader>
        <CardContent>
          {!notionData ? (
            <GuideDialogTriggerButton path="/guide/join#notion" label="🔗 Sign up for Notion" />
          ) : (
            <Button variant="outline" onClick={() => notionDelete()} disabled={notionDeletePending}>
              ❌ Disconnect
            </Button>
          )}
          <br />
          <br />
          <p className="text-xs text-muted-foreground"></p>
        </CardContent>
      </Card>
      {/* Vercel Token */}
      <Card>
        <CardHeader>
          <CardTitle>Vercel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <label className="text-sm text-muted-foreground block">Vercel Token</label>
          <div className="flex gap-2 items-center">
            <Input
              type={isMasked ? 'password' : 'text'}
              value={vercelTokenInput}
              onChange={(e) => setVercelTokenInput(e.target.value)}
            />
            <Button variant="ghost" onClick={() => setIsMasked((prev) => !prev)}>
              {isMasked ? '👁️ Show' : '🙈 Hide'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Your Vercel token will be securely stored.
          </p>
          <br />
          <div className="flex gap-2 items-center">
            {!vercelTokenData ? (
              <GuideDialogTriggerButton
                path="/guide/connect#vercel"
                label="Generate Vercel Token"
              />
            ) : (
              <Button
                variant="outline"
                onClick={() => vercelDelete()}
                disabled={vercelDeletePending}
              >
                ❌ Disconnect
              </Button>
            )}
            <Button onClick={handleSave}>✨ Save</Button>
          </div>
        </CardContent>
      </Card>

      {/* GitHub App */}
      <Card>
        <CardHeader>
          <CardTitle>GitHub App</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {!isLogmeAppInstalled ? (
            <div className="flex items-center gap-2">
              <GuideDialogTriggerButton path="/guide/connect#github-1" label="Connection Guide" />
              <Button onClick={() => handleAppInstall('logme')} variant="outline">
                Connect Logme App
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Logme App connected! </span>
            </div>
          )}
          {!installedVercel ? (
            <div className="flex-col items-center gap-2">
              <div className="flex items-center gap-3">
                <GuideDialogTriggerButton path="/guide/connect#github-2" label="Connection Guide" />
                <Button
                  onClick={() => {
                    if (!isLogmeAppInstalled) {
                      toast.warning('먼저 Logme App을 연결해주세요')
                      return
                    }
                    handleAppInstall('vercel')
                  }}
                  variant="outline"
                >
                  Connect Vercel App
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Vercel App is an external platform, so its connection status cannot be verified.
              </span>
            </div>
          )}
          {isLogmeAppInstalled && installedVercel && (
            <div>
              <br />
              <Button
                variant="outline"
                onClick={() => githubDelete()}
                disabled={githubDeletePending}
              >
                ❌ Disconnect
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
