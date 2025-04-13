import { useEffect } from 'react'
import { useBuilderStore } from '@/stores/logme/builderStore'
import { getProviderToken } from '@/lib/redis/tokenStore'

export const useTemplatePublicWatcher = ({
  enabled,
  notionPageId,
  notionPopup,
  onComplete,
}: {
  enabled: boolean
  notionPageId: string | null
  notionPopup: Window | null
  onComplete?: () => void
}) => {
  const { userId, setBuilderStep } = useBuilderStore()

  useEffect(() => {
    if (!enabled || !notionPageId || !userId) return

    const interval = setInterval(async () => {
      try {
        const notionAccessToken = await getProviderToken(userId!, 'notion')
        console.log('notionAccessToken:', notionAccessToken)

        const res = await fetch(`/api/logme/templates/check-public?notionPageId=${notionPageId}`, {
          headers: {
            Authorization: `Bearer ${notionAccessToken}`,
          },
        })

        if (!res.ok) {
          throw new Error(`서버 응답 오류: ${res.status}`)
        }

        const data = await res.json()

        if (data.isPublic) {
          clearInterval(interval)

          if (notionPopup) notionPopup.close()
          // setBuilderStep(2)
          onComplete?.()
        }
      } catch (error) {
        console.error('게시 상태 확인 중 오류 발생:', error)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [enabled, notionPageId, notionPopup, onComplete, setBuilderStep, userId])
}
