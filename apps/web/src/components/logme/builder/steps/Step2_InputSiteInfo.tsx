'use client'

import { SiteInfoForm } from '@/components/logme/SiteInfoForm'
import { useState } from 'react'
import { useBuilderStore } from '@/stores/logme/builderStore'
import { useUpdateSite } from '@/hooks/logme/site/useUpdateSite'
import { useDeploymentActions } from '@/services/logme/deployment'
import { useSession } from 'next-auth/react'
// import { useAuthStore } from '@/stores/logme/authStore'
import { useSiteBuilderUI } from '@/hooks/logme/site/useSiteBuilderUI'

export default function Step2_InputSiteInfo() {
  const { mutateAsync: updateSiteDB } = useUpdateSite()
  const { startDeploy } = useDeploymentActions()
  const { siteId, setBuilderStep, setDeploymentUrl } = useBuilderStore()
  const { data: session } = useSession()
  // const { github } = useAuthStore()
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
    console.log('🔹 userId:', userId) // ✅ userId 값 확인
    if (!userId) {
      alert('❌ 로그인이 필요합니다.')
      return
    }
    // const tokens = await getAllTokens(userId)

    setIsSaving(true)
    if (siteId) {
      await updateSiteDB({
        id: siteId,
        siteTitle: siteInfo.title,
        siteDescription: siteInfo.description,
      })
      console.log('✅ Site 업데이트:', siteInfo.title, siteInfo.description)
      startDeploy(
        // {
          // vercelToken: tokens?.vercel ?? '', // redis, db
          // notionPageId: notionPageId ?? '', // 1단계에서 저장 가능하지만 db 저장 안 하는 듯?
          // githubInstallationId: `${github?.installationId}`,
          // templateOwner: 'flexyzlogme', // env 로 관리하는 게 나을 듯
          // templateRepo: 'logme-template', // env 로 관리하는 게 나을 듯
          // githubOwner: github.user?.login ?? '', // db에 저장하는지 확인,
          // githubRepoName: `logme-${Date.now()}`, // logme-템플릿네임(영문)-날짜?
          // siteId: siteId ?? '', // 사이트는 1단계에서 저장, 2단계에서 블로그 정보 업데이트(해야 함)
        // },
        () => setIsDeploying(true),
        (url) => {
          setDeploymentUrl(url)
          console.log('배포 중...', siteInfo)
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
