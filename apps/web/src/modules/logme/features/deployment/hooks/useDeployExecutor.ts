import { useBuilderStore } from '@/modules/logme/features/site/stores/builderStore'
import { TEMPLATE_OWNER, TEMPLATE_REPO } from '@/shared/lib/config/client'
import logger from '@/shared/lib/logger'
import { ProviderType } from '@repo/types'
// import { useCreateDeployTarget } from '@/modules/logme/features/deployTarget/hooks/useCreateDeployTarget'
import { useCreateDomain } from '@/modules/logme/features/domain/hooks/useCreateDomain'
import { useFetchProvider } from '@/modules/logme/features/provider/hooks/useFetchProvider'
import { useFetchProviderExtended } from '@/modules/logme/features/provider/hooks/useFetchProviderExtended'
import { useCreateRepo } from '@/modules/logme/features/repo/hooks/useCreateRepo'
import { useUpdateSite } from '@/modules/logme/features/site/hooks/useUpdateSite'
import { checkDeploymentStatus } from './useDeploymentStatusChecker'
import {
  requestDeployment,
  syncRepoAndTarget,
  updateSiteWithDeployment,
} from '../services/deploymentClientService'

export const useDeployExecutor = () => {
  const { setBuilderStep, siteId, notionPageId } = useBuilderStore()
  const { mutateAsync: createRepo } = useCreateRepo()
//   const { mutateAsync: createDeployTarget } = useCreateDeployTarget()
  const { mutateAsync: createDomain } = useCreateDomain()
  const { mutateAsync: updateSite } = useUpdateSite()
  const { data: githubInstallationId } = useFetchProviderExtended('github', 'logmeInstallationId')
  const { data: gitHub } = useFetchProvider(ProviderType.github)
  const githubOwner = gitHub?.name || ''
  const templateOwner = TEMPLATE_OWNER
  const templateRepo = TEMPLATE_REPO

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

      const data = await requestDeployment({
        sub,
        siteTitle,
        siteDescription,
        author,
        notionPageId: notionPageId ?? '',
        githubInstallationId: githubInstallationId ? Number(githubInstallationId) : 0,
        templateOwner,
        templateRepo,
        githubOwner,
        githubRepoName: `logme-${sub}`,
        siteId: siteId || '',
      })
      if (data.url && data.id) {
        logger.log('info', 'Deployment response received:', data)

        const { repo } = await syncRepoAndTarget({
            // const { repo, deployTarget } = await syncRepoAndTarget({
          data,
          githubOwner,
          sub,
          createRepo,
        //   createDeployTarget,
        })
        logger.log('info', 'Repo DB created:', repo)
        // logger.log('info', 'Deploy Target DB created:', deployTarget)

        if (siteId) {
          await updateSiteWithDeployment({
            siteId,
            repoId: repo.id,
            // deployTargetId: deployTarget.id,
            updateSite,
          })
          logger.log('info', 'Site updated:', {
            siteId,
            repoId: repo.id,
            // deployTargetId: deployTarget.id,
          })
        } else {
          logger.log('error', '❌ Site ID is missing.', {
            siteId,
            repoId: repo.id,
            // deployTargetId: deployTarget.id,
          })
        }

        setBuilderStep(3)
        checkDeploymentStatus(data.id, data.targetId, sub, data.deployUrl, onReady || (() => {}), {
          githubOwner,
          siteId: siteId || '',
          createDomain,
          updateSite,
        })
      } else {
        logger.log('error', '❌ Deployment failed:', data)
        alert('배포 실패: ' + (data.error || '알 수 없는 오류'))
      }
    } catch (error) {
      logger.log('error', '❌ Deployment request error:', { error })
      // alert('배포 중 오류가 발생했습니다.')
    }
  }

  return {
    startDeploy,
  }
}
