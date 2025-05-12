import type { ProviderExtended } from '@repo/db'
import { useMutation } from '@tanstack/react-query'

export function useCreateProviderExtended() {
  return useMutation({
    mutationFn: async (providerExtended: Partial<ProviderExtended>) => {
      const res = await fetch('/api/logme/providers/extended', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(providerExtended),
      })
      if (!res.ok) throw new Error('Failed to save provider credential')
      return res.json()
    },
  })
}
