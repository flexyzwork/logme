import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Deployment } from '@repo/db'

// UPDATE
export function useUpdateDeployment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Deployment>) => {
      const res = await fetch(`/api/logme/deployments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Failed to update deployment')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deployment'] })
    },
  })
}
