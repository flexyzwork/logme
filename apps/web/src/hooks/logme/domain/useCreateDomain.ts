import { useMutation } from '@tanstack/react-query'

interface CreateDomainParams {
  sub: string
  vercelProjectId?: string
}

export function useCreateDomain() {
  return useMutation({
    mutationFn: async ({ sub, vercelProjectId }: CreateDomainParams) => {
      const res = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sub,
          vercelProjectId,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || '도메인 생성 실패')
      }

      return res.json()
    },
  })
}
