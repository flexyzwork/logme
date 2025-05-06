import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ContentSource } from '@prisma/client'

// UPDATE
export function useUpdateContentSource() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ sourceId, ...updates }: Partial<ContentSource>) => {
      const res = await fetch(`/api/logme/content-sources/${sourceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Failed to update content source')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentSource'] })
    },
  })
}
