'use client'

import guideData from '@/data/guide-join.json'
import GuideAccordion from '@/modules/logme/components/common/GuideAccordion'

export default function JoinGuidePage() {
  const content = guideData.en
  return (
    <GuideAccordion
      guideData={content}
      title="Sign Up Guide"
      defaultValue={window.location.hash?.replace('#', '')}
    />
  )
}
