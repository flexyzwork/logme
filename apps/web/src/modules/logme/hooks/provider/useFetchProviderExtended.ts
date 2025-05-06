import { useQuery } from '@tanstack/react-query'

// READ
export function useFetchProviderExtended(providerType: string,extendedKey: string, templateId?: string) {
  return useQuery({
    queryKey: ['provider-extended', providerType, extendedKey, templateId],
    queryFn: async () => {
      const url = `/api/logme/providers/extended?providerType=${providerType}&extendedKey=${extendedKey}&templateId=${templateId}`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch provider extended field')
      const data = await res.json()
      return data.value as string | null
    },
    enabled: !!providerType && !!extendedKey,
  })
}
