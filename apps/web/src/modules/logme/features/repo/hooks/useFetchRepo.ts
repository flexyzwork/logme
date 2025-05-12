import { useQuery } from '@tanstack/react-query'
import { Repo } from '@repo/db'

export function useFetchRepo(repoId: string) {
  return useQuery<Repo>({
    queryKey: ['repo', repoId],
    queryFn: async () => {
      const res = await fetch(`/api/logme/repo/${repoId}`)
      if (!res.ok) throw new Error('Failed to fetch repo information')
      return res.json()
    },
    enabled: !!repoId,
  })
}
