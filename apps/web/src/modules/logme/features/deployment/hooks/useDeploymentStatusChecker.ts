/* eslint-disable @typescript-eslint/no-explicit-any */
import logger from '@/shared/lib/logger'

/**
 * Checks deployment status and handles post-deploy actions.
 * Accepts context for dependencies that are not available in this scope.
 */
export const checkDeploymentStatus = async (
  deploymentId: string,
  targetId: string,
  sub: string,
  deployUrl: string,
  onSuccess: (deployUrl: string, gitRepoUrl: string) => void,
  context: {
    githubOwner: string
    siteId: string | undefined
    createDomain: any
    updateSite: any
  }
) => {
  try {
    let status = 'QUEUED'
    while (status === 'BUILDING' || status === 'QUEUED') {
      const res = await fetch('/api/logme/deployments/status', {
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
        onSuccess(deployUrl, `https://github.com/${context.githubOwner}/logme-${sub}`)
        if (context.siteId) {
          await context.createDomain({
            sub,
            vercelProjectId: targetId,
            siteId: context.siteId,
          })
          await context.updateSite({
            id: context.siteId,
            sub,
            domain: `https://logme-${sub}.vercel.app`,
            status: 'published',
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
    // alert('배포 상태 확인 중 오류가 발생했습니다.')
  }
}
