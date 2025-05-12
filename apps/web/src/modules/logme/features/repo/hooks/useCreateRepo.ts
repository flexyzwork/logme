import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Repo } from '@repo/db'

// CREATE
export function useCreateRepo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (repoData: Partial<Repo>) => {
      const res = await fetch('/api/logme/repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(repoData),
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to create repo')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repo'] })
    },
  })
}
