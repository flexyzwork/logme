import { useMutation, useQueryClient } from '@tanstack/react-query'

// DELETE
export function useDeleteRepo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (repoId: string) => {
      const res = await fetch(`/api/logme/repo/${repoId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Repo 삭제 실패')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repo'] })
    },
  })
}
