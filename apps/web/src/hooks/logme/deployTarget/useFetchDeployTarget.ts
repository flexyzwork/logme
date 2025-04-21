import { useQuery } from '@tanstack/react-query'
import { DeployTarget } from '@prisma/client'

export function useFetchDeployTarget(targetId: string) {
  return useQuery<DeployTarget>({
    queryKey: ['deployTarget', targetId],
    queryFn: async () => {
      const res = await fetch(`/api/logme/deploy-targets/${targetId}`)
      if (!res.ok) throw new Error('ContentDeployTargetSource 정보를 불러오지 못했습니다')
      return res.json()
    },
    enabled: !!targetId,
  })
}
