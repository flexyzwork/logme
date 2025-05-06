import logger from '@/shared/lib/logger'
import { ProviderType } from '@/modules/logme/features/provider/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useDeleteProvider(providerType: ProviderType, config?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/logme/providers/${providerType}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to disconnect')
    },
    onSuccess: async () => {
      toast.success(`${providerType} disconnected successfully`)
      await queryClient.invalidateQueries({ queryKey: ['provider', providerType] })
      await queryClient.refetchQueries({ queryKey: ['provider', providerType] })
      await queryClient.invalidateQueries({ queryKey: ['providerExtended', providerType, 'token'] })
      await queryClient.refetchQueries({ queryKey: ['providerExtended', providerType, 'token'] })
      config?.onSuccess?.()
    },
    onError: async (error) => {
      toast.error('An error occurred while disconnecting')
      logger.log('error', 'Error occurred while disconnecting', {
        providerType,
        error: error instanceof Error ? error.message : String(error),
      })
    },
  })
}
