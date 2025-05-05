import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Site } from '@prisma/client'

// UPDATE
export function useUpdateSite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Site>) => {
      const res = await fetch(`/api/logme/sites/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Failed to update site')
      return res.json()
    },
    onSuccess: (updatedSite) => {
      queryClient.setQueryData(['sites'], (old: Site[] | undefined) =>
        old ? old.map(site => site.id === updatedSite.id ? { ...site, ...updatedSite } : site) : []
      )
      queryClient.invalidateQueries({ queryKey: ['sites'] }) // optional fallback
    },
  })
}
