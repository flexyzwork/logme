import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Site } from '@prisma/client'

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
      if (!res.ok) throw new Error('사이트 생성 실패')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
