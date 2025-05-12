import { useQuery } from '@tanstack/react-query'
import type { ContentSource } from '@repo/db'

// READ
export function useFetchContentSource(sourceId: string) {
  return useQuery<ContentSource>({
    queryKey: ['contentSource', sourceId],
    queryFn: async () => {
      const res = await fetch(`/api/logme/content-sources/${sourceId}`)
      if (!res.ok) throw new Error('Failed to fetch content source information')
      return res.json()
    },
    enabled: !!sourceId,
  })
}
