'use client'

import { GuideDialogTriggerButton } from '@/components/logme/common/GuideDialogTriggerButton'
import ConnectionStatus from '@/components/logme/common/ConnectionStatus'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { useDeleteProvider } from '@/hooks/logme/provider/useDeleteProvider'
import { useGithubAppInstall } from '@/hooks/logme/provider/useGithubAppInstall'
import { useCreateProvider } from '@/hooks/logme/provider/useCreateProvider'
import { useCreateProviderExtended } from '@/hooks/logme/provider/useCreateProviderExtended'
import { useSession } from 'next-auth/react'
import { useFetchProviderVercel } from '@/hooks/logme/provider/useFetchProviderVercel'
import { useQueryClient } from '@tanstack/react-query'
import { useFetchProviderExtended } from '@/hooks/logme/provider/useFetchProviderExtended'
import { toast } from 'sonner'
import { useFetchProvider } from '@/hooks/logme/provider/useFetchProvider'
import { decrypt, encrypt } from '@/lib/crypto'

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
      extendedValue: encrypt(vercelTokenInput),
    })

    await invalidateAll()

    setIsMasked(true)
  }

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-6">
      <h1 className="text-2xl font-bold mb-4">계정 관리</h1>
      <div className="flex items-center justify-between gap-4 py-2 px-6 bg-muted rounded-xl">
        {/* 연결 상태 표시 */}
        <div className="flex flex-wrap gap-3 items-center justify">
          <ConnectionStatus provider="notion" connected={!!notionData} />
          <ConnectionStatus provider="vercel" connected={!!vercelTokenData} />
          <ConnectionStatus
            provider="github"
            connected={!!logmeInstallationIdData && !!installedVercel}
          />
        </div>
        {/* 가이드 버튼 */}
        <div className="flex gap-2">
          <GuideDialogTriggerButton path="/guide/join" label="가입 안내" />
          <GuideDialogTriggerButton path="/guide/connect" label="서비스 연결" />
        </div>
      </div>
      <div className="bg-muted/50 border border-border rounded-xl p-4 text-sm text-muted-foreground space-y-2">
        <p>
          📝 <strong>Notion</strong>은 작업 기록을 문서로 백업하거나 정리할 때 유용해요. 나만의 글
          저장소로 활용할 수 있어요.
        </p>
        <p>
          🚀 <strong>Vercel</strong>은 블로그나 포트폴리오를 간단하게 배포할 수 있는 플랫폼이에요.
        </p>
        <p>
          🔗 <strong>GitHub</strong>은 코드 저장과 배포 연결을 위해 필요해요. Vercel과 연동해
          웹사이트를 올릴 수 있어요.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notion</CardTitle>
        </CardHeader>
        <CardContent>
          {!notionData ? (
            <GuideDialogTriggerButton path="/guide/join#notion" label="🔗 Notion 가입하기" />
          ) : (
            <Button variant="outline" onClick={() => notionDelete()} disabled={notionDeletePending}>
              ❌ 연결 끊기
            </Button>
          )}
          <br />
          <br />
          <p className="text-xs text-muted-foreground">
            Notion 연결상태는 빌더에서 템플릿 선택 후 반영됩니다.
          </p>
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
              {isMasked ? '👁️ 보기' : '🙈 숨기기'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Vercel Token은 안전하게 저장됩니다.</p>
          <br />
          <div className="flex gap-2 items-center">
            {!vercelTokenData ? (
              <GuideDialogTriggerButton path="/guide/connect#vercel" label="Vercel 토큰 생성" />
            ) : (
              <Button
                variant="outline"
                onClick={() => vercelDelete()}
                disabled={vercelDeletePending}
              >
                ❌ 연결 끊기
              </Button>
            )}
            <Button onClick={handleSave}>✨ 저장하기</Button>
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
              <GuideDialogTriggerButton path="/guide/connect#github-1" label="연결 안내" />
              <Button onClick={() => handleAppInstall('logme')} variant="outline">
                Logme App 연결
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Logme App 연결 완료! </span>
            </div>
          )}
          {!installedVercel ? (
            <div className="flex-col items-center gap-2">
              <div className="flex items-center gap-3">
                <GuideDialogTriggerButton path="/guide/connect#github-2" label="연결 안내" />
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
                  Vercel App 연결
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Vercel App은 외부 플랫폼이라 연결 상태를 정확히 확인할 수 없습니다.
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
                ❌ 연결 끊기
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
