import { useQuery } from '@tanstack/react-query'
import type { DeployTarget } from '@repo/db'

// READ
export function useFetchDeployTarget(targetId: string) {
  return useQuery<DeployTarget>({
    queryKey: ['deployTarget', targetId],
    queryFn: async () => {
      const res = await fetch(`/api/logme/deploy-targets/${targetId}`)
      if (!res.ok) throw new Error('Failed to fetch deploy target information')
      return res.json()
    },
    enabled: !!targetId,
  })
}
