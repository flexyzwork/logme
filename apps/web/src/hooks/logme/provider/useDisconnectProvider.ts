import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useDisconnectProvider(providerType: 'notion' | 'github' | 'vercel') {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/logme/providers/${providerType}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('연결 해제 실패')
    },
    onSuccess: () => {
      toast.success(`${providerType} 연결이 해제되었습니다`)
      queryClient.invalidateQueries({ queryKey: ['provider', providerType] })
    },
    onError: () => {
      toast.error('연결 해제 중 오류 발생')
    },
  })
}