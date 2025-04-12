import { useMutation, useQueryClient } from '@tanstack/react-query'

// DELETE
export function useDeleteDeployment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/logme/deployments/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Deployment 삭제 실패')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deployment'] })
    },
  })
}
