import { Provider } from '@repo/db'

import { useMutation } from '@tanstack/react-query'

export function useCreateProvider() {
  return useMutation({
    mutationFn: async (providerUser: Partial<Provider>) => {
      const res = await fetch('/api/logme/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(providerUser),
      })
      if (!res.ok) throw new Error('Failed to save provider user information')
      return res.json()
    },
  })
}
