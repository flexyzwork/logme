import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DeployTarget } from '@prisma/client'

// UPDATE
export function useUpdateDeployTarget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ targetId, ...updates }: Partial<DeployTarget>) => {
      const res = await fetch(`/api/logme/deploy-targets/${targetId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Deploy Target 수정 실패')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deployTarget'] })
    },
  })
}
