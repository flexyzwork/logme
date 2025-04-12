import { useQuery } from '@tanstack/react-query'

export function useFetchSites() {
  return useQuery({
    queryKey: ['sites'],
    queryFn: async () => {
      const res = await fetch('/api/logme/sites')
      if (!res.ok) throw new Error('사이트 목록 불러오기 실패')
      return res.json()
    },
  })
}
