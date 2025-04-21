'use client'

import { SiteInfoForm } from '@/components/logme/SiteInfoForm'
import { useState } from 'react'
import { useBuilderStore } from '@/stores/logme/builderStore'
import { useUpdateSite } from '@/hooks/logme/site/useUpdateSite'
import { useDeploymentActions } from '@/services/logme/deployment'
import { useSession } from 'next-auth/react'
import { useSiteBuilderUI } from '@/hooks/logme/site/useSiteBuilderUI'
import { logger } from '@/lib/logger'
import { RESERVED_SUBDOMAINS } from '@/constants/reserved'

export default function Step2_InputSiteInfo() {
  const { mutateAsync: updateSiteDB } = useUpdateSite()
  const { startDeploy } = useDeploymentActions()
  const { siteId, setBuilderStep, setDeployUrl, setSub, setGitRepoUrl } = useBuilderStore()
  const { data: session } = useSession()
  const { setIsDeploying } = useSiteBuilderUI()

  const [siteInfo, setSiteInfo] = useState({
    title: '',
    description: '',
    sub: '',
  })

  const [isSaving, setIsSaving] = useState(false)

  const checkSubAvailable = async (sub: string): Promise<boolean> => {
    const isReserved = RESERVED_SUBDOMAINS.some((word) =>
      sub.toLowerCase().startsWith(word)
    )
    if (isReserved) {
      alert('❌ 사용할 수 없는 서브 도메인입니다.')
      return false
    }
    const res = await fetch(`/api/domains/check-sub?sub=${sub}`)
    const json = await res.json()
    if (!res.ok || json.exists) {
      alert('❌ 이미 사용 중인 서브 도메인입니다.')
      return false
    }
    return true
  }

  const handleChange = (field: 'title' | 'description' | 'sub', value: string) => {
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
    if (!(await checkSubAvailable(siteInfo.sub))) return

    setIsSaving(true)

    // await fetch('/api/domains', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     userId,
    //     siteId,
    //     sub: siteInfo.sub,
    //     // vercelToken: 'user-vercel-token',
    //     // vercelProjectId: 'project-id-from-vercel'
    //   })
    // })

    if (siteId) {
      await updateSiteDB({
        id: siteId,
        sub: siteInfo.sub,
        siteTitle: siteInfo.title,
        siteDescription: siteInfo.description,
      })
      logger.info('✅ Site 업데이트:', {
        sub: siteInfo.sub,
        title: siteInfo.title,
        description: siteInfo.description,
      })
      startDeploy(
        { sub: siteInfo.sub },
        () => setIsDeploying(true),
        (deployUrl, gitRepoUrl) => {
          setDeployUrl(deployUrl)
          setSub(siteInfo.sub)
          setGitRepoUrl(gitRepoUrl)
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
        sub={siteInfo.sub}
        onChange={handleChange}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  )
}
