'use client'

import GuideAccordion from '@/components/logme/common/GuideAccordion'
import guideData from '@/data/guide-connect.json'

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
