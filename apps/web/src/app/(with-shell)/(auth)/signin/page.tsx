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
          <h1 className="text-xl font-semibold text-center">Sign in</h1>

          {emailMode ? (
            <>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button variant="outline" onClick={handleEmailLogin}>
                Send login link
              </Button>
              <Button
                variant="ghost"
                onClick={() => setEmailMode(false)}
                className="text-sm text-muted-foreground"
              >
                Back
              </Button>
            </>
          ) : (
            <>
              <Button variant="default" onClick={() => signIn('google', { callbackUrl })}>
                Continue with Google
              </Button>
              {/* <Button variant="secondary" onClick={() => signIn('github', { callbackUrl })}>
                Continue with GitHub
              </Button> */}

              <Button variant="outline" onClick={() => setEmailMode(true)}>
                Sign in with email
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                By signing in, you agree to our{' '}
                <a href="/privacy" className="underline">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a href="/terms" className="underline">
                  Terms of Service
                </a>
                .
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
