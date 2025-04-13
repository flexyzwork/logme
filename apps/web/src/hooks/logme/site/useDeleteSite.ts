import { useMutation, useQueryClient } from '@tanstack/react-query'

// DELETE
export function useDeleteSite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/logme/sites/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('사이트 삭제 실패')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] })
    },
  })
}
