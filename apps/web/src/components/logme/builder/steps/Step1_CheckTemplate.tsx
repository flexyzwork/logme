'use client'

import { Button } from '@/components/ui/button'
import { useSiteBuilderUI } from '@/hooks/logme/site/useSiteBuilderUI'
import { useTemplatePageOpener } from '@/hooks/logme/template/useTemplatePageOpener'
import { useBuilderStore } from '@/stores/logme/builderStore'
import { useTemplateCopyWatcher } from '@/hooks/logme/template/useTemplateCopyWatcher'
import { useTemplatePublicWatcher } from '@/hooks/logme/template/useTemplatePublicWatcher'

export default function Step1_CheckTemplate({ notionPageId }: { notionPageId: string }) {
  const {
    isCheckingPublic,
    setIsCheckingPublic,
    isCheckingCopy,
    setIsCheckingCopy,
    hasChecked,
    setHasChecked,
    hasCopiedTemplate,
    setIsCopyComplete,
    notionPopup,
    setNotionPopup,
  } = useSiteBuilderUI()
  const { setBuilderStep, step, siteId } = useBuilderStore()
  const { openNotionPageUrl } = useTemplatePageOpener()

  useTemplateCopyWatcher({
    enabled: step === 1 && !!notionPageId && !isCheckingCopy && !hasChecked,
    notionPageId,
    onComplete: () => {
      setIsCheckingCopy(false)
      setHasChecked(true)
      setTimeout(() => {
        setIsCopyComplete(true)
      }, 1000)
    },
    onError: () => {
      setIsCheckingCopy(false)
    },
  })

  const handleOpenNotion = async () => {
    if (!notionPageId) return
    setIsCheckingPublic(true)
    openNotionPageUrl({
      siteId: siteId ?? '',
      notionPageId: notionPageId ?? '',
      onWindow: setNotionPopup,
    })
  }

  useTemplatePublicWatcher({
    enabled: !!notionPageId && !!siteId && isCheckingPublic,
    notionPageId,
    notionPopup,
    onComplete: () => {
      setIsCheckingPublic(false)
      setBuilderStep(2)
    },
  })

  return (
    <>
      <p className="text-center text-gray-700 text-sm">
        In the template page, click the [Share → Publish] button at the top right.
      </p>
      <Button className="w-full mt-4" onClick={handleOpenNotion} disabled={!hasCopiedTemplate}>
        {hasCopiedTemplate ? '🔗 Share Notion Template' : '⏳ Copying template...'}
      </Button>
    </>
  )
}
