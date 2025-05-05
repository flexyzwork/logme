import logger from '@/lib/logger'
import { useBuilderStore } from '@/stores/logme/builderStore'
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

    const checkCopyStatus = async () => {
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
          timeoutId = setTimeout(checkCopyStatus, 2000)
        }
      } catch (error) {
        logger.log('error', '❌ Error while checking template copy status:', { error })
        onError?.(error)
      }
    }

    checkCopyStatus()

    return () => clearTimeout(timeoutId)
  }, [enabled, notionPageId, onComplete, onError, userId, templateId])
}
