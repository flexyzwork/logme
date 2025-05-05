'use client'

import GuideAccordion from '@/components/logme/common/GuideAccordion'
import guideData from '@/data/guide-join.json'

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
