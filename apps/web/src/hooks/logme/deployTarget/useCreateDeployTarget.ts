import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DeployTarget } from '@prisma/client'

// CREATE
export function useCreateDeployTarget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (deployTargetData: Partial<DeployTarget>) => {
      const res = await fetch('/api/logme/deploy-targets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deployTargetData),
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Deploy Target 생성 실패')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deployTarget'] })
    },
  })
}
