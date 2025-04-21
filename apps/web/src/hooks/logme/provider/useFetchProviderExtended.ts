import { useQuery } from '@tanstack/react-query'

export function useFetchProviderExtended(providerType: string,extendedKey: string, templateId?: string) {
  return useQuery({
    queryKey: ['provider-extended', providerType, extendedKey, templateId],
    queryFn: async () => {
      const url = `/api/logme/providers/extended?providerType=${providerType}&extendedKey=${extendedKey}&templateId=${templateId}`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Provider 확장 필드 조회 실패')
      const data = await res.json()
      return data.value as string | null
    },
    enabled: !!providerType && !!extendedKey, // 값이 없으면 요청 안 함
  })
}
