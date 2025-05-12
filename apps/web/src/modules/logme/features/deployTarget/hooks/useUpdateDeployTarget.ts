import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DeployTarget } from '@repo/db'

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
      if (!res.ok) throw new Error('Failed to update deploy target')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deployTarget'] })
    },
  })
}
