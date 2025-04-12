import { useMutation, useQueryClient } from '@tanstack/react-query'

// DELETE
export function useDeleteDeployTarget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (targetId: string) => {
      const res = await fetch(`/api/logme/deploy-targets/${targetId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Deploy Target 삭제 실패')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deployTarget'] })
    },
  })
}
