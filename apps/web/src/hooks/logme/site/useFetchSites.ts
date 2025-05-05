import { useQuery } from '@tanstack/react-query'

export function useFetchSites() {
  return useQuery({
    queryKey: ['sites'],
    queryFn: async () => {
      const res = await fetch('/api/logme/sites')
      if (!res.ok) throw new Error('Failed to fetch site list')
      return res.json()
    },
  })
}
