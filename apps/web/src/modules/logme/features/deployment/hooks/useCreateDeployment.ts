import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Deployment } from '@repo/db'

// CREATE
export function useCreateDeployment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (deploymentData: Partial<Deployment>) => {
      const res = await fetch('/api/logme/deployments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deploymentData),
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to create deployment')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deployment'] })
    },
  })
}
