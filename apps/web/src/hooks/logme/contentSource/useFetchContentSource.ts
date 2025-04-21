import { useQuery } from '@tanstack/react-query'
import { ContentSource } from '@prisma/client'

export function useFetchContentSource(sourceId: string) {
  return useQuery<ContentSource>({
    queryKey: ['contentSource', sourceId],
    queryFn: async () => {
      const res = await fetch(`/api/logme/content-sources/${sourceId}`)
      if (!res.ok) throw new Error('ContentContentSourceSource 정보를 불러오지 못했습니다')
      return res.json()
    },
    enabled: !!sourceId,
  })
}
