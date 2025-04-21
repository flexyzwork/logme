import { decrypt } from '@/lib/crypto'
// import { getProviderToken } from '@/lib/redis/tokenStore'
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
        // const encryptedToken = await getProviderToken(userId!, 'notion')
        // const notionToken = encryptedToken ? decrypt(encryptedToken) : ''

        const response = await fetch(
          `/api/logme/templates/check-copy`,
          {
            // headers: {
            //   Authorization: `Bearer ${notionToken}`,
            // },
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ notionPageId, templateId }),
          }
        )

        const data = await response.json()
        if (data.isCopied) {
          onComplete?.()
        } else {
          timeoutId = setTimeout(checkCopyStatus, 1000)
        }
      } catch (err) {
        console.error('❌ 템플릿 확인 오류:', err)
        onError?.(err)
      }
    }

    checkCopyStatus()

    return () => clearTimeout(timeoutId)
  }, [enabled, notionPageId, onComplete, onError, userId])
}
