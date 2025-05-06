'use client'

import { guideJoin } from '@/modules/logme/contents'
import GuideAccordion from '@/modules/logme/components/landing/GuideAccordion'

export default function JoinGuidePage() {
  const content = guideJoin.en
  return (
    <GuideAccordion
      guideData={content}
      title="Sign Up Guide"
      defaultValue={window.location.hash?.replace('#', '')}
    />
  )
}
