'use client'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/logme/authStore'
import { GITHUB_CLIENT_ID, GITHUB_REDIRECT_URI } from '@/lib/config/client'
// import { getUserFromSession } from '@/lib/session/sessionStore'
// import { redirect } from 'next/navigation'
// import { getProviderToken } from '@/lib/redis/tokenStore'
import { generateOAuthState } from '@/lib/utils'

interface GithubButtonProps {
  text?: string
  stateType?: string
}

export default function GithubButton({
  text = 'GitHub login',
  stateType = 'github:login:',
}: GithubButtonProps) {
  const { setGithubAuthState } = useAuthStore.getState()

  const handleLogin = async () => {
    const state = generateOAuthState(stateType)
    console.log('🔹 생성된 state:', state) // ✅ state 값 확인
    setGithubAuthState(state)

    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: GITHUB_REDIRECT_URI,
      scope: 'read:user user:email read:org',
      state,
    })

    window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`
  }

  return (
    <Button onClick={handleLogin} variant="secondary" className="w-full max-w-[200px]" size="sm">
      {text}
    </Button>
  )
}
