import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ContentSource } from '@prisma/client'

// CREATE
export function useCreateContentSource() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (contentSourceData: Partial<ContentSource>) => {
      const res = await fetch('/api/logme/content-sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentSourceData),
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to create content source')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentSource'] })
    },
  })
}
