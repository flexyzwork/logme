import { useMutation, useQueryClient } from '@tanstack/react-query'

// DELETE
export function useDeleteContentSource() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (sourceId: string) => {
      const res = await fetch(`/api/logme/content-sources/${sourceId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Content Source 삭제 실패')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentSource'] })
    },
  })
}
