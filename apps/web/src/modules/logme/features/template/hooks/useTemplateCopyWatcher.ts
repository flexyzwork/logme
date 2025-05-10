import logger from '@/shared/lib/logger'
import { useBuilderStore } from '@/modules/logme/features/site/stores/builderStore'
import { useEffect } from 'react'

export const useTemplateCopyWatcher = ({
  enabled,
  notionPageId,
  onComplete,
  onError,
}: {
  enabled: boolean
  notionPageId: string | null
  onComplete?: () => void
  onError?: (error: unknown) => void
}) => {
  const { userId, templateId } = useBuilderStore()

  useEffect(() => {
    if (!enabled || !notionPageId) return

    let timeoutId: NodeJS.Timeout
    let attemptCount = 0

    const checkCopyStatus = async () => {
      if (attemptCount >= 10) return
      attemptCount++

      try {
        const response = await fetch(`/api/logme/templates/check-copy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ notionPageId, templateId }),
        })

        const data = await response.json()
        if (data.isCopied) {
          onComplete?.()
        } else {
          timeoutId = setTimeout(checkCopyStatus, 5000)
        }
      } catch (error) {
        logger.log('error', '❌ Error while checking template copy status:', { error })
        onError?.(error)
      }
    }

    timeoutId = setTimeout(checkCopyStatus, 5000)

    return () => clearTimeout(timeoutId)
  }, [enabled, notionPageId, onComplete, onError, userId, templateId])
}
