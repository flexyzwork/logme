'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useBuilderStore } from '@/stores/logme/builderStore'
import { useAuthStore } from '@/stores/logme/authStore'
import { useCreateProvider } from '@/hooks/logme/provider/useCreateProvider'
import { useSession } from 'next-auth/react'
import { storeProviderToken } from '@/lib/redis/tokenStore'

export default function GithubCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUserId, setBuilderStep } = useBuilderStore()
  const { github, loginGithub } = useAuthStore()
  const { mutateAsync: storeProviderUser } = useCreateProvider()
  const { data: session, status } = useSession()

  console.log('✅ zustand authState:', useAuthStore.getState().github.authState)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const executedRef = useRef(false)

  useEffect(() => {
    if (executedRef.current || status !== 'authenticated') return
    executedRef.current = true

    const code = searchParams.get('code')
    const state = searchParams.get('state')

    console.log('🔹 code:', code)
    console.log('🔹 state:', state)
    console.log('✅ userId:', session.user?.id)

    if (!code) {
      setError('❌ 유효하지 않은 인증 요청입니다. (code 없음)')
      setLoading(false)
      return
    }

    if (!state || state !== github?.authState) {
      console.warn('❌ 유효하지 않은 인증 요청입니다. (state 없거나 불일치)')
      setError('❌ 유효하지 않은 인증 요청입니다. (state 불일치)')
      setLoading(false)
      return
    }

    const fetchToken = async () => {
      let currentUserId = session.user?.id

      try {
        console.log('📥 요청된 GitHub code:', code)
        const response = await fetch('/api/logme/providers/github', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        })

        if (!response.ok) throw new Error('GitHub 토큰 요청 실패')

        const data = await response.json()
        console.log('📡 GitHub 토큰 응답:', data)

        const { user, access_token: accessToken } = data
        console.log('🔑 발급된 access_token:', accessToken)
        console.log('👤 GitHub 사용자 정보:', user)

        const providerUser = {
          providerType: 'github',
          providerUserId: user?.id ?? '',
          name: user?.login ?? '',
          email: user.email ?? '',
          avatar_url: user?.avatar_url ?? '',
          userId: currentUserId,
        }

        const res = await storeProviderUser(providerUser)
        const newUserId = res.userId

        const githubUser = {
          id: user?.id ?? '',
          name: user?.name ?? '',
          email: user?.email ?? '',
          avatar_url: user?.avatar_url ?? '',
          login: user?.login ?? '',
        }
        loginGithub(githubUser)

        console.log('🔑 newUserId:', newUserId)
        if (!currentUserId || currentUserId !== newUserId) {
          currentUserId = newUserId
        }

        setUserId(currentUserId)
        storeProviderToken(currentUserId!, 'github', accessToken)

        const stateParts = state.split(':')
        const stateType = stateParts[1]

        if (stateType.startsWith('login')) {
          router.replace('/post-login')
        } else {
          router.replace('/logme/builder')
        }
      } catch (err) {
        console.error('❌ 인증 중 오류:', err)
        setError('GitHub 인증에 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchToken()
  }, [
    session,
    status,
    searchParams,
    setBuilderStep,
    router,
    storeProviderUser,
    github,
    setUserId,
    loginGithub,
  ])

  if (status === 'loading' || loading) return <p className="text-center">🔄 GitHub 인증 중...</p>
  if (!session) return <p className="text-center text-red-500">로그인이 필요합니다</p>
  if (error) return <p className="text-center text-red-500">{error}</p>

  return null
}
