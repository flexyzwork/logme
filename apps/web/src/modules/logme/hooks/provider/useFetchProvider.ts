import { ProviderType } from '@/modules/logme/types/types'
import { Provider } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'

// READ
export function useFetchProvider(providerType: ProviderType) {
  return useQuery<Provider>({
    queryKey: ['provider', providerType],
    queryFn: async () => {
      const res = await fetch(`/api/logme/providers/${providerType}`)
      if (!res.ok) throw new Error('Failed to fetch provider information')
      return res.json()
    },
    enabled: !!providerType,
  })
}