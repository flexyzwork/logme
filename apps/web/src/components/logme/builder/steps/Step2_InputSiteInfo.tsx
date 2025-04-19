'use client'

import { SiteInfoForm } from '@/components/logme/SiteInfoForm'
import { useState } from 'react'
import { useBuilderStore } from '@/stores/logme/builderStore'
import { useUpdateSite } from '@/hooks/logme/site/useUpdateSite'
import { useDeploymentActions } from '@/services/logme/deployment'
import { useSession } from 'next-auth/react'
import { useSiteBuilderUI } from '@/hooks/logme/site/useSiteBuilderUI'
import { logger } from '@/lib/logger'

export default function Step2_InputSiteInfo() {
  const { mutateAsync: updateSiteDB } = useUpdateSite()
  const { startDeploy } = useDeploymentActions()
  const { siteId, setBuilderStep, setDeploymentUrl } = useBuilderStore()
  const { data: session } = useSession()
  const { setIsDeploying } = useSiteBuilderUI()

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
    const userId = session?.user?.id
    if (!userId) {
      alert('❌ 로그인이 필요합니다.')
      return
    }
    setIsSaving(true)
    if (siteId) {
      await updateSiteDB({
        id: siteId,
        siteTitle: siteInfo.title,
        siteDescription: siteInfo.description,
      })
      logger.info('✅ Site 업데이트:', {title: siteInfo.title, description: siteInfo.description})
      startDeploy(
        () => setIsDeploying(true),
        (url) => {
          setDeploymentUrl(url)
          logger.info('배포 중...', siteInfo)
          setIsSaving(false)
          setBuilderStep(4)
        }
      )
    } else {
      console.error('❌ Site ID가 없습니다.')
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center text-gray-700 text-sm">
        🎉 Notion 템플릿 게시가 완료되었습니다. <br />
        사이트 정보를 입력해 주세요. <br />
        저장을 누르면 Vercel 배포를 진행합니다.
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
