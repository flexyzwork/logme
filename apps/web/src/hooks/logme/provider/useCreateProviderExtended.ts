import { useMutation } from '@tanstack/react-query'

interface providerExtended {
  providerType: 'notion' | 'github' | 'vercel' | string
  extendedKey: string
  extendedValue: string
}

export function useCreateProviderExtended() {
  return useMutation({
    mutationFn: async (providerExtended: providerExtended) => {
      const res = await fetch('/api/logme/providers/extended', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(providerExtended),
      })
      if (!res.ok) throw new Error('제공자 인증 정보 저장 실패')
      return res.json()
    },
  })
}
