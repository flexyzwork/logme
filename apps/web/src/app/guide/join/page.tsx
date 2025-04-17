'use client'
import GuideAccordion from '@/components/logme/common/GuideAccordion'
import guideData from '@/data/guide-join.json'

export default function JoinGuidePage() {
  return (
    <GuideAccordion
      guideData={guideData}
      title="가입가이드"
      defaultValue={window.location.hash?.replace('#', '')}
    />
  )
}
