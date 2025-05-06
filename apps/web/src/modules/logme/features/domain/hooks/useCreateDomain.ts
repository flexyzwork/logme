import { useMutation } from '@tanstack/react-query'

interface CreateDomainParams {
  sub: string
  vercelProjectId?: string
  siteId?: string
}

export function useCreateDomain() {
  return useMutation({
    mutationFn: async ({ sub, vercelProjectId, siteId }: CreateDomainParams) => {
      const res = await fetch('/api/logme/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sub,
          vercelProjectId,
          siteId,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to create domain')
      }

      return res.json()
    },
  })
}
