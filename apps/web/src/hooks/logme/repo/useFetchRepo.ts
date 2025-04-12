import { useQuery } from '@tanstack/react-query'
import { Repo } from '@prisma/client'

export function useFetchRepo(repoId: string) {
  return useQuery<Repo>({
    queryKey: ['repo', repoId],
    queryFn: async () => {
      const res = await fetch(`/api/logme/repo/${repoId}`)
      if (!res.ok) throw new Error('Repo 정보를 불러오지 못했습니다')
      return res.json()
    },
    enabled: !!repoId, // repoId 없을 땐 요청 안 보냄
  })
}
