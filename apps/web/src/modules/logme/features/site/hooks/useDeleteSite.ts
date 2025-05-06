import { useMutation, useQueryClient } from '@tanstack/react-query'

// DELETE
export function useDeleteSite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/logme/sites/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete site')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] })
    },
  })
}
