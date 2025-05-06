'use client'

import logger from '@/shared/lib/logger'
import { Button } from '@/shared/components/ui/button'

import { useTransition } from 'react'
import { toast } from 'sonner'

interface Props {
  providerType: 'notion' | 'github' | 'vercel'
  onSuccess?: () => void
}

export function DisconnectProviderButton({ providerType, onSuccess }: Props) {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/logme/providers/${providerType}`, {
          method: 'DELETE',
        })

        if (!res.ok) {
          throw new Error(`Failed to disconnect: ${providerType}`)
        }

        toast.success(`${providerType} disconnected successfully`)
        onSuccess?.()
      } catch (error) {
        logger.log('error', 'An error occurred while disconnecting.', {
          providerType,
          error: error instanceof Error ? error.message : String(error),
        })
        toast.error(`An error occurred while disconnecting.`)
      }
    })
  }

  return (
    <Button variant="destructive" onClick={handleClick} disabled={isPending}>
      ❌ Disconnect
    </Button>
  )
}
