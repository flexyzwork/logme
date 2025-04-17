'use client'

import { GuideDialogTriggerButton } from '@/components/logme/common/GuideDialogTriggerButton'
import ConnectionStatus from '@/components/logme/common/ConnectionStatus'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { storeProviderToken } from '@/lib/redis/tokenStore'
import { useDisconnectProvider } from '@/hooks/logme/provider/useDisconnectProvider'
import { useGithubAppInstall } from '@/hooks/logme/provider/useGithubAppInstall'
import { useCreateProvider } from '@/hooks/logme/provider/useCreateProvider'
import { useCreateProviderExtended } from '@/hooks/logme/provider/useCreateProviderExtended'
import { useSession } from 'next-auth/react'
import { useFetchProviderVercel } from '@/hooks/logme/provider/useFetchProviderVercel'
import { useFetchProviderExtended } from '@/hooks/logme/provider/useFetchProviderExtended'

export default function SettingsPage() {
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
  const { mutate: notionDelete, isPending: notionDeletePending } = useDisconnectProvider('notion')
  const { mutate: githubDelete, isPending: githubDeletePending } = useDisconnectProvider('github')
  const { mutate: vercelDelete, isPending: vercelDeletePending } = useDisconnectProvider('vercel')
  const [vercelToken, setVercelToken] = useState<string>('')
  // const [logmeInstallation, setLogmeInstallation] = useState<boolean>(false)
  const [isNotionConnected, setIsNotionConnected] = useState<boolean>(
    notionTokenData ? true : false
  )
  const [hasInitialized, setHasInitialized] = useState(false)
  const {
    handleAppInstall,
    isLogmeAppInstalled,
    installedVercel,
    setIsLogmeAppInstalled,
    setInstalledVercel,
  } = useGithubAppInstall()

  useEffect(() => {
    if (vercelTokenData && !hasInitialized) {
      setVercelToken(vercelTokenData)
      console.log('🔹 vercelTokenData:', vercelTokenData)
      setHasInitialized(true)
    }
  }, [vercelTokenData, hasInitialized])

  useEffect(() => {
    if (logmeInstallationIdData) setIsLogmeAppInstalled(true)
    console.log('🔹 logmeInstallationIdData:', logmeInstallationIdData)
    if (vercelInstallation) setInstalledVercel(true)
  }, [logmeInstallationIdData, vercelInstallation, setInstalledVercel, setIsLogmeAppInstalled])

  useEffect(() => {
    if (notionTokenData) setIsNotionConnected(true)
  }, [notionTokenData])

  useEffect(() => {
    if (logmeInstallationIdData) setIsLogmeAppInstalled(true)
    if (vercelInstallation) setInstalledVercel(true)
    // if (logmeInstallationIdData && vercelInstallation) setIsGithubInstalled(true)
  }, [logmeInstallationIdData, vercelInstallation, setInstalledVercel, setIsLogmeAppInstalled])

  const handleSave = async () => {
    console.log('🔹 vercelToken:', vercelToken) // ✅ vercelToken 값 확인

    console.log('🔹 userId:', session?.user?.id) // ✅ userId 값 확인

    const { user } = await fetchUser(vercelToken)

    const userId = session?.user?.id

    console.log('🔐 Vercel 사용자 정보:', user.uid)
    const providerUser = {
      providerType: 'vercel',
      providerUserId: user.uid,
      name: user.username || '',
      email: user.email,
      image: user.avatar || '',
      userId,
    }

    console.log('🔐 providerUser:', providerUser)

    await storeProviderUser.mutateAsync(providerUser)

    const providerExtended = {
      providerType: 'vercel',
      extendedKey: 'token',
      extendedValue: vercelToken,
    }
    await storeProviderExtended.mutateAsync(providerExtended)

    storeProviderToken(userId!, 'vercel', vercelToken)

    setIsMasked(false)
  }

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-6">
      <h1 className="text-2xl font-bold mb-4">계정 관리</h1>
      <div className="flex gap-2">
        <span className="mt-1.5">가이드:</span>
        <GuideDialogTriggerButton path="/guide/join" label="가입" />
        <GuideDialogTriggerButton path="/guide/connect" label="연결" />
      </div>
      {/* <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
        <div className="flex flex-wrap gap-3 items-center">
          <ConnectionStatus provider="notion" connected={isNotionConnected} />
          <ConnectionStatus
            provider="github"
            connected={!!logmeInstallationId && !!installedVercel}
          />
          <ConnectionStatus provider="vercel" connected={vercelToken !== ''} />
        </div>
      </div> */}

      {/* Notion 연결 */}

      <Card>
        <CardHeader>
          <CardTitle>Notion</CardTitle>
        </CardHeader>
        <CardContent>
          {!isNotionConnected ? (
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
          {!vercelToken ? (
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
              value={vercelToken}
              onChange={(e) => setVercelToken(e.target.value)}
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
          {!installedVercel ? (
            <div className="flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <GuideDialogTriggerButton path="/guide/connect#github-2" label="설치 가이드" />
                <Button onClick={() => handleAppInstall('vercel')} variant="outline" size="sm">
                  Vercel App 설치
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* <input
                type="checkbox"
                checked={installedVercel}
                onClick={(e) => e.preventDefault()}
                readOnly
              />
              <label className="text-sm text-gray-700">Vercel App 설치완료</label> */}
              <span>Vercel App 설치완료</span>
            </div>
          )}

          {!isLogmeAppInstalled ? (
            <div className="flex items-center gap-2">
              <GuideDialogTriggerButton path="/guide/connect#github-1" label="설치 가이드" />
              <Button onClick={() => handleAppInstall('logme')} variant="outline" size="sm">
                Logme App 설치
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* <input
                type="checkbox"
                checked={isLogmeAppInstalled}
                onClick={(e) => e.preventDefault()}
                readOnly
              />
              <label className="text-sm text-gray-700">Logme App 설치완료</label> */}
              <span>Logme App 설치완료</span>
            </div>
          )}

          {isLogmeAppInstalled && installedVercel && (
            <Button variant="outline" onClick={() => githubDelete()} disabled={githubDeletePending}>
              ❌ 연결 끊기
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
