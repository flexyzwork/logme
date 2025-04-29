'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

export default function SignInPage() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const [email, setEmail] = useState('')
  const [emailMode, setEmailMode] = useState(false)

  const handleEmailLogin = async () => {
    await signIn('email', { email, callbackUrl })
  }

  return (
    <div className="flex min-h-[calc(100vh-110px)] items-center justify-center px-4">
      <Card className="w-full max-w-sm p-4 shadow-lg">
        <CardContent className="flex flex-col gap-4">
          <h1 className="text-xl font-semibold text-center">로그인</h1>

          {emailMode ? (
            <>
              <Input
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button variant="outline" onClick={handleEmailLogin}>
                로그인 링크 보내기
              </Button>
              <Button
                variant="ghost"
                onClick={() => setEmailMode(false)}
                className="text-sm text-muted-foreground"
              >
                돌아가기
              </Button>
            </>
          ) : (
            <>
              <Button variant="default" onClick={() => signIn('google', { callbackUrl })}>
                Google로 로그인
              </Button>
              {/* <Button variant="secondary" onClick={() => signIn('github', { callbackUrl })}>
                GitHub로 로그인
              </Button> */}

              <Button variant="outline" onClick={() => setEmailMode(true)}>
                이메일로 로그인하기
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                로그인 시{' '}
                <a href="/privacy" className="underline">
                  개인정보처리방침
                </a>{' '}
                및{' '}
                <a href="/terms" className="underline">
                  이용약관
                </a>
                에 동의하게 됩니다.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
