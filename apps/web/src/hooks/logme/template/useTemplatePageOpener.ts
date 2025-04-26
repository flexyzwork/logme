import { useBuilderStore } from '@/stores/logme/builderStore'
import { useUpdateContentSource } from '@/hooks/logme/contentSource/useUpdateContentSource'
import logger from '@/lib/logger'

export const useTemplatePageOpener = () => {
  const { templateId } = useBuilderStore()
  const { mutateAsync: updateContentSourceDB } = useUpdateContentSource()

  const openNotionPageUrl = async ({
    notionPageId,
    onWindow,
    onError,
  }: {
    siteId: string
    notionPageId: string
    onWindow?: (w: Window) => void
    onError?: (e: unknown) => void
  }) => {
    try {
      const res = await fetch(`/api/logme/templates/get-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notionPageId, templateId }),
      })
      const data = await res.json()

      if (data.url) {
        await updateContentSourceDB({ sourceId: notionPageId, sourceUrl: data.url })

        const newWindow = window.open(data.url, '_blank')
        onWindow?.(newWindow as Window)
      } else {
        alert('❌ Notion 페이지를 불러오는데 실패했습니다.')
      }
    } catch (error) {
      logger.log('error', '❌ Notion URL fetch error:', { error })
      onError?.(e)
    }
  }

  return {
    openNotionPageUrl,
  }
}
