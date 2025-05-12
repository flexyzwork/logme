import { useQuery } from '@tanstack/react-query'
import type { Site } from '@repo/db'

export function useFetchSite(siteId: string) {
  return useQuery<Site>({
    queryKey: ['site', siteId],
    queryFn: async () => {
      const res = await fetch(`/api/logme/sites/${siteId}`)
      if (!res.ok) throw new Error('Failed to fetch site information')
      return res.json()
    },
    enabled: !!siteId,
  })
}
