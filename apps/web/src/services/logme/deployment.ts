import { useBuilderStore } from '@/stores/logme/builderStore'
import { useSiteStore } from '@/stores/logme/siteStore'
import { useUpdateSite } from '@/hooks/logme/site/useUpdateSite'
import { useCreateRepo } from '@/hooks/logme/repo/useCreateRepo'
import { useCreateDeployTarget } from '@/hooks/logme/deployTarget/useCreateDeployTarget'
import { useCreateDeployment } from '@/hooks/logme/deployment/useCreateDeployment'
import { SiteStatus } from '@prisma/client'
import { db } from '@repo/db'
import { useFetchProviderExtended } from '@/hooks/logme/provider/useFetchProviderExtended'

export const useDeploymentActions = () => {
  const { setBuilderStep, siteId } = useBuilderStore()
  const { updateSite } = useSiteStore()
  const { mutateAsync: createRepoDB } = useCreateRepo()
  const { mutateAsync: createDeployTargetDB } = useCreateDeployTarget()
  const { mutateAsync: createDeploymentDB } = useCreateDeployment()
  const { mutateAsync: updateSiteDB } = useUpdateSite()
  const { data: vercelToken } = useFetchProviderExtended('vercel', 'token')

  const checkDeploymentStatus = async (
    deploymentId: string,
    vercelToken: string,
    onSuccess: (url: string) => void
  ) => {
    try {
      let status = 'QUEUED'
      while (status === 'BUILDING' || status === 'QUEUED') {
        const res = await fetch(
          `/api/logme/deployments/vercel/status?deploymentId=${deploymentId}&vercelToken=${vercelToken}`
        )
        const data = await res.json()
        status = data.readyState || data.status

        if (status === 'READY') {
          onSuccess(data.url)
          if (siteId) {
            await updateSiteDB({
              id: siteId,
              domain: `https://${data.url}`,
              status: SiteStatus.published,
            })
            console.log('✅ 사이트 도메인 업데이트 완료:', data.url)
            // setBuilderStep(0)
          }
          // alert('✅ 배포가 완료되었습니다. 🚀')
          return
        }

        await new Promise((resolve) => setTimeout(resolve, 5000))
      }

      // alert('❌ 배포가 실패했습니다.')
    } catch (error) {
      console.error('❌ 배포 상태 확인 오류:', error)
      alert('배포 상태 확인 중 오류가 발생했습니다.')
    }
  }

  const startDeploy = async (
    params: {
      // vercelToken: string
      notionPageId: string
      // githubInstallationToken: string
      githubInstallationId: string
      templateOwner: string
      templateRepo: string
      githubOwner: string
      githubRepoName: string
      siteId: string
    },
    onDeploying?: () => void,
    onReady?: (url: string) => void
  ) => {
    try {
      onDeploying?.()
        if (!vercelToken) {
        console.error('❌ Vercel API 토큰이 없습니다.')
        return
        }
      console.log('🚀 Vercel 배포 요청: vercelToken', { vercelToken })

      const response = await fetch('/api/logme/deployments/vercel/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...params, vercelToken}), 
      })

      const data = await response.json()
      if (data.url && data.id) {
        console.log('✅ 배포 응답!!!!!!!!! :', data)

        updateSite(params.siteId, {
          domain: data.url,
          githubRepo: { id: data.repoId, name: params.githubRepoName },
          vercelProject: { id: data.id, name: params.githubRepoName },
        })

        const repo = await createRepoDB({
          repoId: `${data.repoId}`,
          repoName: params.githubRepoName,
          repoUrl: `https://github.com/${params.githubOwner}/${params.githubRepoName}`,
          repoOwner: params.githubOwner,
          repoBranch: data.repoBranch,
        })
        console.log('✅ Repo DB 생성:', repo)

        const deployTarget = await createDeployTargetDB({
          targetId: data.targetId,
          targetName: data.targetName,
          targetUrl: data.url,
        })
        console.log('✅ Deploy Target DB 생성:', deployTarget)

        const deployment = await createDeploymentDB({
          deployTargetId: deployTarget.id,
          // targetUrl: data.url,
        })

        console.log('✅ Deployment DB 생성:', deployment)

        if (params.siteId) {
          await updateSiteDB({
            id: params.siteId,
            repoId: repo.id,
            deployTargetId: deployTarget.id,
            status: SiteStatus.draft,
          })
          console.log('✅ Site 업데이트:', siteId, repo.id, deployTarget.id)
        } else {
          console.error('❌ Site ID가 없습니다.')
        }

        setBuilderStep(3)
        checkDeploymentStatus(data.id, vercelToken, onReady || (() => {}))
      } else {
        console.error('❌ 배포 실패:', data)

        alert('배포 실패: ' + (data.error || '알 수 없는 오류'))
      }
    } catch (error) {
      console.error('❌ 배포 요청 오류:', error)
      alert('배포 중 오류가 발생했습니다.')
    }
  }

  return {
    startDeploy,
  }
}
