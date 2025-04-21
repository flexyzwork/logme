import { useQuery } from '@tanstack/react-query'
import { Deployment } from '@prisma/client'

export function useFetchDeployment(id: string) {
  return useQuery<Deployment>({
    queryKey: ['deployment', id],
    queryFn: async () => {
      const res = await fetch(`/api/logme/deployments/${id}`)
      if (!res.ok) throw new Error('Deployment 정보를 불러오지 못했습니다')
      return res.json()
    },
    enabled: !!id,
  })
}
