'use client'

import { useSiteBuilderUI } from '@/modules/logme/features/site/hooks/useSiteBuilderUI'
import { useTemplateCopyWatcher } from '@/modules/logme/features/template/hooks/useTemplateCopyWatcher'
import { useTemplatePageOpener } from '@/modules/logme/features/template/hooks/useTemplatePageOpener'
import { useTemplatePublicWatcher } from '@/modules/logme/features/template/hooks/useTemplatePublicWatcher'
import { useBuilderStore } from '@/modules/logme/features/site/stores/builderStore'
import { Button } from '@/shared/components/ui/button'

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
