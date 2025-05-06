import { useBuilderStore } from '@/modules/logme/stores/builderStore'
import { TEMPLATE_OWNER, TEMPLATE_REPO } from '@/shared/lib/config/client'
import logger from '@/shared/lib/logger'
import { ProviderType, SiteStatus } from '@repo/types'
import { useCreateDeployment } from '@/modules/logme/hooks/deployment/useCreateDeployment'
import { useCreateDeployTarget } from '@/modules/logme/hooks/deployTarget/useCreateDeployTarget'
import { useCreateDomain } from '@/modules/logme/hooks/domain/useCreateDomain'
import { useFetchProvider } from '@/modules/logme/hooks/provider/useFetchProvider'
import { useFetchProviderExtended } from '@/modules/logme/hooks/provider/useFetchProviderExtended'
import { useCreateRepo } from '@/modules/logme/hooks/repo/useCreateRepo'
import { useUpdateSite } from '@/modules/logme/hooks/site/useUpdateSite'

export const useDeploymentActions = () => {
  const { setBuilderStep, siteId, notionPageId } = useBuilderStore()
  const { mutateAsync: createRepoDB } = useCreateRepo()
  const { mutateAsync: createDeployTargetDB } = useCreateDeployTarget()
  const { mutateAsync: createDeploymentDB } = useCreateDeployment()
  const { mutateAsync: createDomain } = useCreateDomain()
  const { mutateAsync: updateSiteDB } = useUpdateSite()
  const { data: githubInstallationId } = useFetchProviderExtended('github', 'logmeInstallationId')
  const { data: gitHub } = useFetchProvider(ProviderType.github)
  const githubOwner = gitHub?.name || ''
  const templateOwner = TEMPLATE_OWNER
  const templateRepo = TEMPLATE_REPO

  const checkDeploymentStatus = async (
    deploymentId: string,
    targetId: string,
    sub: string,
    deployUrl: string,
    onSuccess: (deployUrl: string, gitRepoUrl: string) => void
  ) => {
    try {
      let status = 'QUEUED'
      while (status === 'BUILDING' || status === 'QUEUED') {
        const res = await fetch('/api/logme/deployments/vercel/status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ deploymentId }),
        })
        const data = await res.json()
        status = data.readyState || data.status

        if (status === 'READY') {
          logger.log('info', 'Deployment complete:', data)
          onSuccess(deployUrl, `https://github.com/${githubOwner}/logme-${sub}`)
          if (siteId) {
            await createDomain({
              sub,
              vercelProjectId: targetId,
              siteId,
            })
            await updateSiteDB({
              id: siteId,
              sub,
              domain: `https://logme-${sub}.vercel.app`,
              status: SiteStatus.published,
            })
            logger.log('info', 'Site domain update complete:', {
              domain: `https://logme-${sub}.vercel.app`,
            })
          }
          return
        }

        await new Promise((resolve) => setTimeout(resolve, 5000))
      }
    } catch (error) {
      logger.log('error', '❌ Error while checking deployment status:', { error })

      alert('배포 상태 확인 중 오류가 발생했습니다.')
    }
  }

  const startDeploy = async (
    params: {
      sub: string
      siteTitle?: string
      siteDescription?: string
      author?: string
    },

    onDeploying?: () => void,
    onReady?: (deployUrl: string, gitRepoUrl: string) => void
  ) => {
    try {
      onDeploying?.()
      const { sub, siteTitle, siteDescription, author } = params
      if (!githubOwner) {
        logger.log('error', '❌ githubOwner is missing.')
        return
      }
      logger.log('info', '🚀 Deployment request from githubOwner:', { githubOwner })
      if (!githubInstallationId) {
        logger.log('error', '❌ githubInstallationId가 없습니다.')

        return
      }
      logger.log('info', '🚀 Deployment request with githubInstallationId:', {
        githubInstallationId,
      })

      const response = await fetch('/api/logme/deployments/vercel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sub,
          siteTitle,
          siteDescription,
          author,
          notionPageId,
          githubInstallationId,
          templateOwner,
          templateRepo,
          githubOwner,
          githubRepoName: `logme-${sub}`,
          siteId,
        }),
      })

      const data = await response.json()
      if (data.url && data.id) {
        logger.log('info', 'Deployment response received:', data)

        const repo = await createRepoDB({
          repoId: `${data.repoId}`,
          repoName: `logme-${sub}`,
          repoUrl: `https://github.com/${githubOwner}/logme-${sub}`,
          repoOwner: githubOwner,
          repoBranch: data.repoBranch,
        })
        logger.log('info', 'Repo DB created:', repo)

        const deployTarget = await createDeployTargetDB({
          targetId: data.targetId,
          targetName: data.targetName,
          targetUrl: data.url,
        })
        logger.log('info', 'Deploy Target DB created:', deployTarget)

        const deployment = await createDeploymentDB({
          deployTargetId: deployTarget.id,
          deployId: data.id,
          deployUrl: data.deployUrl,
        })

        logger.log('info', 'Deployment DB created:', deployment)

        if (siteId) {
          await updateSiteDB({
            id: siteId,
            repoId: repo.id,
            deployTargetId: deployTarget.id,
            status: SiteStatus.draft,
          })
          logger.log('info', 'Site updated:', {
            siteId,
            repoId: repo.id,
            deployTargetId: deployTarget.id,
          })
        } else {
          logger.log('error', '❌ Site ID is missing.', {
            siteId,
            repoId: repo.id,
            deployTargetId: deployTarget.id,
          })
        }

        setBuilderStep(3)
        checkDeploymentStatus(data.id, data.targetId, sub, data.deployUrl, onReady || (() => {}))
      } else {
        logger.log('error', '❌ Deployment failed:', data)

        alert('배포 실패: ' + (data.error || '알 수 없는 오류'))
      }
    } catch (error) {
      logger.log('error', '❌ Deployment request error:', { error })
      alert('배포 중 오류가 발생했습니다.')
    }
  }

  return {
    startDeploy,
  }
}
