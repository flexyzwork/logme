'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useBuilderStore } from '@/stores/logme/builderStore'
import { storeProviderToken } from '@/lib/redis/tokenStore'
import { useCreateProvider } from '@/hooks/logme/provider/useCreateProvider'
import { useFetchProviderVercel } from '@/hooks/logme/provider/useFetchProviderVercel'
import { useCreateProviderExtended } from '@/hooks/logme/provider/useCreateProviderExtended'
import { useFetchProviderExtended } from '@/hooks/logme/provider/useFetchProviderExtended'
import { useSession } from 'next-auth/react'

export default function Step3_InputVercelToken() {
  const { mutateAsync: fetchUser } = useFetchProviderVercel()
  const storeProviderUser = useCreateProvider()
  const storeProviderExtended = useCreateProviderExtended()
  const { showToken, setShowToken, setBuilderStep } = useBuilderStore()
  const { data: token } = useFetchProviderExtended('vercel', 'token')
  const { data: session } = useSession()
  const [input, setInput] = useState('')

  const openPopup = (url: string, name: string) => {
    const width = 600
    const height = 700
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    window.open(
      url,
      name,
      `width=${width},height=${height},top=${top},left=${left},resizable,scrollbars`
    )
  }

  useEffect(() => {
    if (token && input === '') setInput(token)
  }, [token, input])

  const handleSave = async () => {
    console.log('🔹 vercelToken:', input) // ✅ vercelToken 값 확인

    console.log('🔹 userId:', session?.user?.id) // ✅ userId 값 확인

    const { user } = await fetchUser(input)

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
      extendedValue: input,
    }
    await storeProviderExtended.mutateAsync(providerExtended)

    storeProviderToken(userId!, 'vercel', input)

    setShowToken(false)
    setBuilderStep(4)
  }

  if (!session) return <p className="text-center text-red-500">로그인이 필요합니다</p>

  return (
    <div className="space-y-4">
      <span className="text-center text-gray-700 text-sm">
        🎉 Notion 템플릿 게시가 완료되었습니다. <br />
        <br />
        📌 Vercel 후 API 토큰을 생성 후 입력해 주세요.
        <br />
        (EXPIRATION: <strong>No Expiration</strong>)
      </span>

      <div className="flex items-center justify-center gap-2 mt-2 mb-4">
        <Button
          onClick={() =>
            openPopup(
              'https://vercel.com/login?next=%2Faccount%2Fsettings%2Ftokens',
              'vercel-login'
            )
          }
          variant="outline"
          size="sm"
        >
          로그인
        </Button>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">🔑 Vercel API 토큰</label>
        <div className="relative">
          <input
            type={showToken ? 'text' : 'password'}
            placeholder="Vercel API 토큰 입력"
            className="border rounded w-full p-2 pr-10 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
            onClick={() => setShowToken(!showToken)}
          >
            {showToken ? '🔐' : '👀'}
          </button>
        </div>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
        onClick={handleSave}
        disabled={!input}
      >
        토큰 저장
      </Button>
    </div>
  )
}
