'use client'

import { guideConnect } from '@/modules/logme/contents'
import GuideAccordion from '@/modules/logme/components/landing/GuideAccordion'

export default function ConnectGuidePage() {
  const content = guideConnect.en
  return (
    <GuideAccordion
      guideData={content}
      title="Connect Services"
      defaultValue={window.location.hash?.replace('#', '')}
    />
  )
}
