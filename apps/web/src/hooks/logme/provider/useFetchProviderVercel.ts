import { useMutation } from '@tanstack/react-query'

export function useFetchProviderVercel() {
  return useMutation({
    mutationFn: async (token: string) => {
      const res = await fetch('/api/logme/providers/vercel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      if (!res.ok) throw new Error('Failed to fetch user information')
      return res.json()
    },
  })
}
