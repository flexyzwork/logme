'use client'

import { GuideDialogTriggerButton } from '@/components/logme/common/GuideDialogTriggerButton'
import ConnectionStatus from '@/components/logme/common/ConnectionStatus'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import { useDisconnectProvider } from '@/hooks/logme/provider/useDisconnectProvider'

export default function SettingsPage() {
  const [isMasked, setIsMasked] = useState(true)
  const [isNotionConnected, setIsNotionConnected] = useState(true)
  const [isGithubInstalled, setIsGithubInstalled] = useState(true)
  const [vercelToken, setVercelToken] = useState<string>('')
  const { mutate: notionDelete, isPending: notionDeletePending } = useDisconnectProvider('notion')
  const { mutate: githubDelete, isPending: githubDeletePending } = useDisconnectProvider('notion')
  const { mutate: vercelDelete, isPending: vercelDeletePending } = useDisconnectProvider('vercel')

  const handleSave = () => {
    // 저장 로직
    console.log('Saved settings!')
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
          <ConnectionStatus provider="notion" connected={isNotionConnected} />
          <ConnectionStatus provider="github" connected={isGithubInstalled} />
          <ConnectionStatus provider="vercel" connected={vercelToken !== ''} />
        </div>
      </div>

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
        </CardContent>
      </Card>

      {/* GitHub App */}
      <Card>
        <CardHeader>
          <CardTitle>GitHub App</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          {!isGithubInstalled ? (
            <>
              <GuideDialogTriggerButton path="/guide/connect#github-1" label="Logme App 설치" />
              <GuideDialogTriggerButton path="/guide/connect#github-2" label="Vercel App 설치" />
            </>
          ) : (
            <Button variant="outline" onClick={() => githubDelete()} disabled={githubDeletePending}>
              ❌ 연결 끊기
            </Button>
          )}
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
    </div>
  )
}
