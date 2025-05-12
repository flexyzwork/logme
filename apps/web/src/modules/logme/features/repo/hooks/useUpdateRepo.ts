import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Repo } from '@repo/db'

// UPDATE
export function useUpdateRepo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ repoId, ...updates }: Partial<Repo>) => {
      const res = await fetch(`/api/logme/repo/${repoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Failed to update repo')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repo'] })
    },
  })
}
