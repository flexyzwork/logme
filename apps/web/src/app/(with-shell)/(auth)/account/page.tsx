'use client'

import { GuideDialogTriggerButton } from '@/components/logme/common/GuideDialogTriggerButton'
import ConnectionStatus from '@/components/logme/common/ConnectionStatus'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState, useRef } from 'react'
import { storeProviderToken } from '@/lib/redis/tokenStore'
import { useDeleteProvider } from '@/hooks/logme/provider/useDeleteProvider'
import { useGithubAppInstall } from '@/hooks/logme/provider/useGithubAppInstall'
import { useCreateProvider } from '@/hooks/logme/provider/useCreateProvider'
import { useCreateProviderExtended } from '@/hooks/logme/provider/useCreateProviderExtended'
import { useSession } from 'next-auth/react'
import { useFetchProviderVercel } from '@/hooks/logme/provider/useFetchProviderVercel'
import { useQueryClient } from '@tanstack/react-query'
import { useFetchProviderExtended } from '@/hooks/logme/provider/useFetchProviderExtended'
import { toast } from 'sonner'

// Query key constants
const providerKeys = {
  notion: ['provider', 'notion'],
  notionToken: ['providerExtended', 'notion', 'token'],
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

  const { data: vercelTokenData } = useFetchProviderExtended('vercel', 'token')
  const { data: notionTokenData } = useFetchProviderExtended('notion', 'token')
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
  const isFetching = useRef(false)

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
      providerType: 'vercel',
      providerUserId: user.uid,
      name: user.username || '',
      email: user.email,
      image: user.avatar || '',
      userId: session.user.id,
    }

    await storeProviderUser.mutateAsync(providerUser)

    await storeProviderExtended.mutateAsync({
      providerType: 'vercel',
      extendedKey: 'token',
      extendedValue: vercelTokenInput,
    })

    storeProviderToken(session.user.id, 'vercel', vercelTokenInput)

    await invalidateAll()

    setIsMasked(true)
  }

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-6">
      <h1 className="text-2xl font-bold mb-4">계정 관리</h1>
      <div className="flex gap-2">
        <span className="mt-1.5">가이드:</span>
        <GuideDialogTriggerButton path="/guide/join" label="가입" />
        <GuideDialogTriggerButton path="/guide/connect" label="연결" />
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
        <div className="flex flex-wrap gap-3 items-center">
          <ConnectionStatus provider="notion" connected={!!notionTokenData} />
          <ConnectionStatus provider="vercel" connected={!!vercelTokenData} />
          <ConnectionStatus
            provider="github"
            connected={!!logmeInstallationIdData && !!installedVercel}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notion</CardTitle>
        </CardHeader>
        <CardContent>
          {!notionTokenData ? (
            <GuideDialogTriggerButton path="/guide/join#notion" label="🔗 Notion 가입하기" />
          ) : (
            <Button variant="outline" onClick={() => notionDelete()} disabled={notionDeletePending}>
              ❌ 연결 끊기
            </Button>
          )}
          <br />
          <br />
          <p className="text-xs text-muted-foreground">
            Notion 연결은 빌더에서 템플릿 선택 후 반영됩니다.
          </p>
        </CardContent>
      </Card>
      {/* Vercel Token */}
      <Card>
        <CardHeader>
          <CardTitle>Vercel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {!vercelTokenData ? (
            <GuideDialogTriggerButton path="/guide/connect#vercel" label="Vercel 토큰 생성" />
          ) : (
            <Button variant="outline" onClick={() => vercelDelete()} disabled={vercelDeletePending}>
              ❌ 연결 끊기
            </Button>
          )}
          <br />
          <br />
          <label className="text-sm text-muted-foreground block">Vercel Token</label>
          <div className="flex gap-2 items-center">
            <Input
              type={isMasked ? 'password' : 'text'}
              value={vercelTokenInput}
              onChange={(e) => setVercelTokenInput(e.target.value)}
            />
            <Button variant="ghost" onClick={() => setIsMasked((prev) => !prev)}>
              {isMasked ? '👁️ 보기' : '🙈 숨기기'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Vercel Token은 안전하게 저장됩니다.</p>
          <div className="text-right">
            <Button onClick={handleSave}>✨ 저장하기</Button>
          </div>
        </CardContent>
      </Card>

      {/* GitHub App */}
      <Card>
        <CardHeader>
          <CardTitle>GitHub App</CardTitle>
        </CardHeader>
        <CardContent className="flex-col gap-2">
          {!isLogmeAppInstalled ? (
            <div className="flex items-center gap-2">
              <GuideDialogTriggerButton path="/guide/connect#github-1" label="설치 가이드" />
              <Button onClick={() => handleAppInstall('logme')} variant="outline" size="sm">
                Logme App 설치
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>Logme App 설치완료</span>
            </div>
          )}
          {!installedVercel ? (
            <div className="flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <GuideDialogTriggerButton path="/guide/connect#github-2" label="설치 가이드" />
                <Button
                  onClick={() => {
                    if (!isLogmeAppInstalled) {
                      toast.warning('먼저 Logme App을 설치해주세요')
                      return
                    }
                    handleAppInstall('vercel')
                  }}
                  variant="outline"
                  size="sm"
                >
                  Vercel App 설치
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>Vercel App 설치완료</span>
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
                ❌ 연결 끊기
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
