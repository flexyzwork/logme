'use client'

import guideData from '@/data/guide-connect.json'
import GuideAccordion from '@/modules/logme/components/common/GuideAccordion'

export default function ConnectGuidePage() {
  const content = guideData.en
  return (
    <GuideAccordion
      guideData={content}
      title="Connect Services"
      defaultValue={window.location.hash?.replace('#', '')}
    />
  )
}
