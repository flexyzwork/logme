'use client'

import { useGithubAppInstall } from '@/hooks/logme/provider/useGithubAppInstall'
import { useDeploymentActions } from '@/services/logme/deployment'
import { useAuthStore } from '@/stores/logme/authStore'
import { useBuilderStore } from '@/stores/logme/builderStore'
import { useSiteBuilderUI } from '@/hooks/logme/site/useSiteBuilderUI'
import { Button } from '@/components/ui/button'
import { useFetchProviderExtended } from '@/hooks/logme/provider/useFetchProviderExtended'
import { useEffect, useState } from 'react'
import { getAllTokens } from '@/lib/redis/tokenStore'
import { useSession } from 'next-auth/react'

export default function Step4_InstallGithubApp() {
  const { data: logmeInstallationId } = useFetchProviderExtended('github', 'logmeInstallationId')
  const { data: vercelInstallation } = useFetchProviderExtended('github', 'vercelInstallation')
  const { data: session, status } = useSession()

  const { startDeploy } = useDeploymentActions()
  const { siteId, notionPageId, setBuilderStep, setDeploymentUrl } = useBuilderStore()
  const { github } = useAuthStore()

  // const vercelToken = useAuthStore.getState().vercel.accessToken
  const {
    handleAppInstall,
    isLogmeAppInstalled,
    installedVercel,
    setIsLogmeAppInstalled,
    setInstalledVercel,
  } = useGithubAppInstall()
  const { setIsDeploying } = useSiteBuilderUI()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (logmeInstallationId) setIsLogmeAppInstalled(true)
    if (vercelInstallation) setInstalledVercel(true)
  }, [logmeInstallationId, vercelInstallation, setInstalledVercel, setIsLogmeAppInstalled])

  // TODO: 백엔드로 전체적으로 보내야할 로직(특히 githubInstallationToken 은 10분 만료인데 거의 있을리가 없음... 다시 인증 받도록해야 함)
  const handleDeploy = async () => {
    const userId = session?.user?.id
    console.log('🔹 userId:', userId) // ✅ userId 값 확인
    if (!userId) {
      alert('❌ 로그인이 필요합니다.')
      return
    }

    const tokens = await getAllTokens(userId)
    console.log('🔹 tokens:', tokens) // ✅ tokens 값 확인
    console.log('🔹 github:', github) // ✅ github 값 확인

    if (!github.installationId) {
      alert('❌ Github App 설치가 필요합니다.')
      return
    }

    startDeploy(
      {
        vercelToken: tokens?.vercel ?? '', // redis, db
        notionPageId: notionPageId ?? '', // 1단계에서 저장 가능하지만 db 저장 안 하는 듯?
        githubInstallationId: `${github?.installationId}`,
        templateOwner: 'flexyzlogme', // env 로 관리하는 게 나을 듯
        templateRepo: 'logme-template', // env 로 관리하는 게 나을 듯
        githubOwner: github.user?.login ?? '', // db에 저장하는지 확인,
        githubRepoName: `logme-${Date.now()}`, // logme-템플릿네임(영문)-날짜?
        siteId: siteId ?? '', // 사이트는 1단계에서 저장, 2단계에서 블로그 정보 업데이트(해야 함)
      },
      () => setIsDeploying(true),
      (url) => {
        setDeploymentUrl(url)
        setBuilderStep(6)
      }
    )
  }

  // if (status === 'loading' || loading) return <p className="text-center">🔄 인증 중...</p>
  if (!session) return <p className="text-center text-red-500">로그인이 필요합니다</p>

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center text-gray-700 text-sm">
        Github App 설치 후 배포를 진행해 주세요.
      </p>

      {!(installedVercel && isLogmeAppInstalled) && (
        <div className="flex items-center justify-center gap-2">
          <Button onClick={() => handleAppInstall('vercel')} variant="outline" size="sm">
            Vercel App 설치
          </Button>
          <Button onClick={() => handleAppInstall('logme')} variant="outline" size="sm">
            Logme App 설치
          </Button>
        </div>
      )}

      <div className="flex items-center justify-center gap-20">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={installedVercel}
            onChange={(e) => setInstalledVercel(e.target.checked)}
          />
          <label className="text-sm text-gray-700">설치완료</label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isLogmeAppInstalled}
            onChange={(e) => setIsLogmeAppInstalled(e.target.checked)}
          />
          <label className="text-sm text-gray-700">설치완료</label>
        </div>
      </div>

      <Button
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm"
        onClick={handleDeploy}
        disabled={!(installedVercel && isLogmeAppInstalled)}
      >
        🚀 배포 시작
      </Button>
    </div>
  )
}
