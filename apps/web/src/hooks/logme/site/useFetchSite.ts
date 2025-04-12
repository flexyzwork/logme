import { useQuery } from '@tanstack/react-query'
import { Site } from '@prisma/client'

export function useFetchSite(siteId: string) {
  return useQuery<Site>({
    queryKey: ['site', siteId],
    queryFn: async () => {
      const res = await fetch(`/api/logme/sites/${siteId}`)
      if (!res.ok) throw new Error('사이트 정보를 불러오지 못했습니다')
      return res.json()
    },
    enabled: !!siteId, // siteId 없을 땐 요청 안 보냄
  })
}
