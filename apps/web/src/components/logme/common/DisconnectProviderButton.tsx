'use client'

import { Button } from '@/components/ui/button'
import { sendAlertFromClient } from '@/lib/alert'
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
          throw new Error(`연결 해제 실패: ${providerType}`)
        }

        toast.success(`${providerType} 연결이 해제되었습니다`)
        onSuccess?.()
      } catch (err) {
        console.error(err)
        toast.error(`연결 해제 중 오류가 발생했습니다.`)
        await sendAlertFromClient({
          type: 'error',
          message: '연결 해제 중 오류가 발생했습니다.',
          meta: { providerType, error: err instanceof Error ? err.message : String(err) },
        })
      }
    })
  }

  return (
    <Button variant="destructive" onClick={handleClick} disabled={isPending}>
      ❌ 연결 끊기
    </Button>
  )
}
