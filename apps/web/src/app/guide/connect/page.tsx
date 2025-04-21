'use client'

import GuideAccordion from '@/components/logme/common/GuideAccordion'
import guideData from '@/data/guide-connect.json'

export default function ConnectGuidePage() {
  return (
    <GuideAccordion
      guideData={guideData}
      title="서비스 연결"
      defaultValue={window.location.hash?.replace('#', '')}
    />
  )
}
