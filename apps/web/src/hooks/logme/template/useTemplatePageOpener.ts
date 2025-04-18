import { useBuilderStore } from '@/stores/logme/builderStore'
import { getProviderToken } from '@/lib/redis/tokenStore'
// import { useSiteStore } from '@/stores/logme/siteStore'
import { useUpdateContentSource } from '@/hooks/logme/contentSource/useUpdateContentSource'

export const useTemplatePageOpener = () => {
  const { userId } = useBuilderStore()
  // const { updateSite } = useSiteStore()
  const { mutateAsync: updateContentSourceDB } = useUpdateContentSource()

  const openNotionPageUrl = async ({
    siteId,
    notionPageId,
    onWindow,
    onError,
  }: {
    siteId: string
    notionPageId: string
    onWindow?: (w: Window) => void
    onError?: (e: unknown) => void
  }) => {
    const notionAccessToken = await getProviderToken(userId!, 'notion')
    console.log('notionAccessToken:', notionAccessToken)
    // if (!notionAccessToken || !notionPageId) {
    //   alert('❌ Notion 인증 정보가 없습니다.')
    //   return
    // }

    try {
      const res = await fetch(`/api/logme/templates/get-url?notionPageId=${notionPageId}`, {
        headers: {
          Authorization: `Bearer ${notionAccessToken}`,
        },
      })
      const data = await res.json()

      if (data.url) {
        // updateSite(siteId, {
        //   notionPage: {
        //     url: data.url,
        //     id: notionPageId,
        //   },
        // })
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
