import { useMutation, useQueryClient } from '@tanstack/react-query'

// Define the interface based on the Prisma schema
interface DeployTarget {
  id: string
  name: string
  provider: string
  targetId: string
  targetUrl?: string | null
  createdAt: Date
  updatedAt: Date
}

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
      if (!res.ok) throw new Error('Failed to create deploy target')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deployTarget'] })
    },
  })
}
