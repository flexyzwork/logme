'use client'

import { SiteInfoForm } from '@/components/logme/SiteInfoForm'
import { useState } from 'react'
import { useBuilderStore } from '@/stores/logme/builderStore'
import { useUpdateSite } from '@/hooks/logme/site/useUpdateSite'

export default function Step2_InputSiteInfo() {
  const { setBuilderStep, siteId } = useBuilderStore()
  const { mutateAsync: updateSiteDB } = useUpdateSite()

  const [siteInfo, setSiteInfo] = useState({
    title: '',
    description: '',
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (field: 'title' | 'description', value: string) => {
    setSiteInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    if (siteId) {
      await updateSiteDB({
        id: siteId,
        siteTitle: siteInfo.title,
        siteDescription: siteInfo.description,
      })
      console.log('✅ Site 업데이트:', siteInfo.title, siteInfo.description)
    } else {
      console.error('❌ Site ID가 없습니다.')
    }
    console.log('저장 중...', siteInfo)
    setIsSaving(false)
    setBuilderStep(3)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center text-gray-700 text-sm">
        🎉 Notion 템플릿 게시가 완료되었습니다. <br />
        사이트 정보를 입력해 주세요.
      </p>
      <SiteInfoForm
        title={siteInfo.title}
        description={siteInfo.description}
        onChange={handleChange}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  )
}
