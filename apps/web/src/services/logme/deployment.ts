import { useBuilderStore } from '@/stores/logme/builderStore'
import { useUpdateSite } from '@/hooks/logme/site/useUpdateSite'
import { useCreateRepo } from '@/hooks/logme/repo/useCreateRepo'
import { useCreateDeployTarget } from '@/hooks/logme/deployTarget/useCreateDeployTarget'
import { useCreateDeployment } from '@/hooks/logme/deployment/useCreateDeployment'
import { SiteStatus, ProviderType } from '@prisma/client'
import { useFetchProviderExtended } from '@/hooks/logme/provider/useFetchProviderExtended'
import { useFetchProvider } from '@/hooks/logme/provider/useFetchProvider'
import { decrypt } from '@/lib/crypto'
import { logger } from '@/lib/logger'
import { sendAlertFromClient } from '@/lib/alert'
import { useCreateDomain } from '@/hooks/logme/domain/useCreateDomain'

export const useDeploymentActions = () => {
  const { setBuilderStep, siteId, notionPageId } = useBuilderStore()
  const { mutateAsync: createRepoDB } = useCreateRepo()
  const { mutateAsync: createDeployTargetDB } = useCreateDeployTarget()
  const { mutateAsync: createDeploymentDB } = useCreateDeployment()
  const { mutateAsync: createDomain } = useCreateDomain()
  const { mutateAsync: updateSiteDB } = useUpdateSite()
  const { data: encryptedVercelTokenData } = useFetchProviderExtended('vercel', 'token')
  const vercelToken = encryptedVercelTokenData ? decrypt(encryptedVercelTokenData) : ''
  const { data: githubInstallationId } = useFetchProviderExtended('github', 'logmeInstallationId')
  const { data: gitHub } = useFetchProvider(ProviderType.github)
  const githubOwner = gitHub?.name || ''
  const githubRepoName = `logme-${Date.now()}`
  // TODO: 템플릿 선택 후 템플릿 소유자와 레포지토리 이름을 동적으로 설정
  const templateOwner = 'flexyzlogme'
  const templateRepo = 'logme-template'

  const checkDeploymentStatus = async (
    deploymentId: string,
    vercelToken: string,
    targetId: string,
    sub: string,
    deployUrl: string,
    onSuccess: (deployUrl: string, gitRepoUrl: string) => void
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
          logger.info('✅ 배포 완료:', data)
          onSuccess(deployUrl, `https://github.com/${githubOwner}/${githubRepoName}`)
          await createDomain({
            // siteId,
            sub,
            vercelToken,
            vercelProjectId: targetId,
          })
          if (siteId) {
            await updateSiteDB({
              id: siteId,
              sub,
              domain: `https://${sub}.logme.click`,
              status: SiteStatus.published,
            })
            logger.info('✅ 사이트 도메인 업데이트 완료:', { domain: `https://${sub}.logme.click` })
          }
          return
        }

        await new Promise((resolve) => setTimeout(resolve, 5000))
      }
    } catch (error) {
      logger.error('❌ 배포 상태 확인 오류:', { error })
      await sendAlertFromClient({
        type: 'error',
        message: '배포 상태 확인 실패',
        meta: {
          error,
        },
      })
      alert('배포 상태 확인 중 오류가 발생했습니다.')
    }
  }

  const startDeploy = async (
    params: {
      sub: string
    },

    onDeploying?: () => void,
    onReady?: (deployUrl: string, gitRepoUrl: string) => void
  ) => {
    try {
      onDeploying?.()
      const { sub } = params
      if (!vercelToken) {
        logger.error('❌ Vercel API 토큰이 없습니다.')
        await sendAlertFromClient({
          type: 'error',
          message: 'Vercel API 토큰이 없습니다.',
        })
        return
      }
      logger.info('🚀 Vercel 배포 요청: vercelToken', { vercelToken })
      if (!githubOwner) {
        logger.error('❌ githubOwner가 없습니다.')
        await sendAlertFromClient({
          type: 'error',
          message: 'githubOwner가 없습니다.',
        })
        return
      }
      logger.info('🚀 githubOwner 배포 요청: githubOwner', { githubOwner })
      if (!githubInstallationId) {
        logger.error('❌ githubInstallationId가 없습니다.')
        await sendAlertFromClient({
          type: 'error',
          message: 'githubInstallationId가 없습니다.',
        })
        return
      }
      logger.info('🚀 githubInstallationId 배포 요청: githubInstallationId', {
        githubInstallationId,
      })

      const response = await fetch('/api/logme/deployments/vercel/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sub,
          vercelToken,
          notionPageId,
          githubInstallationId,
          templateOwner,
          templateRepo,
          githubOwner,
          githubRepoName,
          siteId,
        }),
      })

      const data = await response.json()
      if (data.url && data.id) {
        logger.info('✅ 배포 응답!!!!!!!!! :', data)

        const repo = await createRepoDB({
          repoId: `${data.repoId}`,
          repoName: githubRepoName,
          repoUrl: `https://github.com/${githubOwner}/${githubRepoName}`,
          repoOwner: githubOwner,
          repoBranch: data.repoBranch,
        })
        logger.info('✅ Repo DB 생성:', repo)

        const deployTarget = await createDeployTargetDB({
          targetId: data.targetId,
          targetName: data.targetName,
          targetUrl: data.url,
        })
        logger.info('✅ Deploy Target DB 생성:', deployTarget)

        const deployment = await createDeploymentDB({
          deployTargetId: deployTarget.id,
          deployId: data.id,
          deployUrl: data.deployUrl,
        })

        logger.info('✅ Deployment DB 생성:', deployment)

        if (siteId) {
          await updateSiteDB({
            id: siteId,
            repoId: repo.id,
            deployTargetId: deployTarget.id,
            status: SiteStatus.draft,
          })
          logger.info('✅ Site 업데이트:', {
            siteId,
            repoId: repo.id,
            deployTargetId: deployTarget.id,
          })
        } else {
          logger.error('❌ Site ID가 없습니다.')
          await sendAlertFromClient({
            type: 'error',
            message: '사이트 ID가 없습니다.',
          })
        }

        setBuilderStep(3)
        checkDeploymentStatus(
          data.id,
          vercelToken,
          data.targetId,
          sub,
          data.deployUrl,
          onReady || (() => {})
        )
      } else {
        logger.error('❌ 배포 실패:', data)
        await sendAlertFromClient({
          type: 'error',
          message: '배포 실패',
          meta: { error: data.error || '알 수 없는 오류' },
        })

        alert('배포 실패: ' + (data.error || '알 수 없는 오류'))
      }
    } catch (error) {
      logger.error('❌ 배포 요청 오류:', { error })
      await sendAlertFromClient({
        type: 'error',
        message: '배포 요청 오류',
        meta: { error },
      })
      alert('배포 중 오류가 발생했습니다.')
    }
  }

  return {
    startDeploy,
  }
}
