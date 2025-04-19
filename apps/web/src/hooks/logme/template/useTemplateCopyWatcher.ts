import { decrypt } from '@/lib/crypto'
import { getProviderToken } from '@/lib/redis/tokenStore'
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
  const { userId } = useBuilderStore()

  useEffect(() => {
    if (!enabled || !notionPageId) return

    let timeoutId: NodeJS.Timeout

    const checkCopyStatus = async () => {
      try {
        const encryptedToken = await getProviderToken(userId!, 'notion')
        if (!encryptedToken) {
          alert('❌ Notion 인증 정보가 없습니다.')
          return
        }
        console.log('notionAccessToken(encryptedToken):', encryptedToken)
        const notionAccessToken = decrypt(encryptedToken)

        const response = await fetch(
          `/api/logme/templates/check-copy?notionPageId=${notionPageId}`,
          {
            headers: {
              Authorization: `Bearer ${notionAccessToken}`,
            },
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
