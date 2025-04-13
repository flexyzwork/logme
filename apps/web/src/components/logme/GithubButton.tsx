'use client'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/logme/authStore'
import { useBuilderStore } from '@/stores/logme/builderStore'
import { GITHUB_CLIENT_ID, GITHUB_REDIRECT_URI } from '@/lib/config/client'
import { generateOAuthState } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

interface GithubButtonProps {
  text?: string
  stateType?: string
}

export default function GithubButton({
  text = 'GitHub login',
  stateType = 'github:login:',
}: GithubButtonProps) {
  const { setGithubAuthState } = useAuthStore.getState()
  const { step, setBuilderStep } = useBuilderStore()
  const { data: session } = useSession()

  const handleLogin = async () => {
    if (!session) {
      toast('로그인이 필요합니다', {
        description: '계속하려면 로그인해주세요.',
      })
      setTimeout(() => {
        window.location.href = `/signin?callbackUrl=${encodeURIComponent('/logme/builder')}`
      }, 1500)
      return
    }

    if (step !== 0) {
      const ok = window.confirm('이전에 만들던 블로그가 있습니다. \n이어서 하시겠습니까? \n(취소를 누르면 처음부터 다시 시작합니다.)')
      if (!ok) {
        setBuilderStep(0)
      }
    }
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
    <Button onClick={handleLogin} className="mt-2" size="sm">
      {text}
    </Button>
  )
}
