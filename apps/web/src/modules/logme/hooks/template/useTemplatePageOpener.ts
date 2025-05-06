import { useBuilderStore } from '@/modules/logme/stores/builderStore'
import logger from '@/shared/lib/logger'
import { useUpdateContentSource } from '@/modules/logme/hooks/contentSource/useUpdateContentSource'

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
        alert('❌ Failed to load the Notion page.')
      }
    } catch (error) {
      logger.log('error', '❌ Failed to fetch Notion page URL:', { error })
      onError?.(error)
    }
  }

  return {
    openNotionPageUrl,
  }
}
