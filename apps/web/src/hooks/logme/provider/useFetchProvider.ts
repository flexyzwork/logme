import { Provider } from '@prisma/client'
import {useQuery } from '@tanstack/react-query'

export function useFetchProvider(providerType: 'notion' | 'github' | 'vercel') {
return useQuery<Provider>({
  queryKey: ['provider', providerType],
  queryFn: async () => {
    const res = await fetch(`/api/logme/providers/${providerType}`)
    if (!res.ok) throw new Error('provider 정보를 불러오지 못했습니다')
    return res.json()
  },
  enabled: !!providerType, // providerType 없을 땐 요청 안 보냄
})
}