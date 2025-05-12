import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Site } from '@repo/db'

// CREATE
export function useCreateSite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (siteData: Partial<Site>) => {
      const res = await fetch('/api/logme/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteData),
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to create site')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] })
    },
  })
}
