import { useQuery } from '@tanstack/react-query'
import type { Deployment } from '@repo/db'

// READ
export function useFetchDeployment(id: string) {
  return useQuery<Deployment>({
    queryKey: ['deployment', id],
    queryFn: async () => {
      const res = await fetch(`/api/logme/deployments/${id}`)
      if (!res.ok) throw new Error('Failed to fetch deployment information')
      return res.json()
    },
    enabled: !!id,
  })
}
