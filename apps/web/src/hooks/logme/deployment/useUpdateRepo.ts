import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Deployment } from '@prisma/client'

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
      if (!res.ok) throw new Error('Deployment 수정 실패')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deployment'] })
    },
  })
}
