import { useMutation } from '@tanstack/react-query'

interface ProviderUser {
  providerType: 'notion' | 'github' | 'vercel' | string
  providerUserId: string
  name: string
  email?: string
  image?: string
}

export function useCreateProvider() {
  return useMutation({
    mutationFn: async (providerUser: ProviderUser) => {
      const res = await fetch('/api/logme/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(providerUser),
      })
      if (!res.ok) throw new Error('제공자 사용자 정보 저장 실패')
      return res.json()
    },
  })
}
