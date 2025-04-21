import { useBuilderStore } from '@/stores/logme/builderStore'
// import { getProviderToken } from '@/lib/redis/tokenStore'
import { useUpdateContentSource } from '@/hooks/logme/contentSource/useUpdateContentSource'
// import { decrypt } from '@/lib/crypto'

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
    // const encryptedToken = await getProviderToken(userId!, 'notion')
    // const notionToken = encryptedToken ? decrypt(encryptedToken) : ''
    try {
      const res = await fetch(`/api/logme/templates/get-url`, {
        // headers: {
        //   Authorization: `Bearer ${notionToken}`,
        // },
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
    } catch (e) {
      console.error('❌ Notion URL fetch error:', e)
      onError?.(e)
    }
  }

  return {
    openNotionPageUrl,
  }
}
