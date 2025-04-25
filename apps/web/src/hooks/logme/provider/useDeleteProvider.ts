import logger from '@/lib/logger'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useDeleteProvider(
  providerType: 'notion' | 'github' | 'vercel',
  config?: { onSuccess?: () => void }
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/logme/providers/${providerType}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('연결 해제 실패')
    },
    onSuccess: async () => {
      toast.success(`${providerType} 연결이 해제되었습니다`)
      await queryClient.invalidateQueries({ queryKey: ['provider', providerType] })
      await queryClient.refetchQueries({ queryKey: ['provider', providerType] })
      await queryClient.invalidateQueries({ queryKey: ['providerExtended', providerType, 'token'] })
      await queryClient.refetchQueries({ queryKey: ['providerExtended', providerType, 'token'] })
      config?.onSuccess?.()
    },
    onError: async (error) => {
      toast.error('연결 해제 중 오류 발생')
      logger.log('error', '연결 해제 중 오류 발생', {
        providerType,
        error: error instanceof Error ? error.message : String(error),
      })
    },
  })
}
