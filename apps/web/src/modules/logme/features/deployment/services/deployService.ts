import { decrypt } from '@/shared/lib/crypto'
import { cloneFromTemplateRepo } from '@/modules/logme/features/repo/services/githubService'
import { db } from '@repo/db'
import {
  createVercelProject,
  setVercelEnvs,
  triggerVercelDeployment,
} from '@/modules/logme/features/deployTarget/services/vercelService'

export async function deployToVercel({
  notionPageId,
  githubInstallationId,
  templateOwner,
  templateRepo,
  githubOwner,
  githubRepoName,
  author,
  siteTitle,
  siteDescription,
  sub,
  userId,
}: {
  notionPageId: string
  githubInstallationId: number
  templateOwner: string
  templateRepo: string
  githubOwner: string
  githubRepoName: string
  author: string
  siteTitle: string
  siteDescription: string
  sub: string
  userId: string
}) {
  const { fullName, repoId } = await cloneFromTemplateRepo({
    githubInstallationId,
    templateOwner,
    templateRepo,
    githubOwner,
    githubRepoName,
  })

  const provider = await db.provider.findFirst({
    where: { userId, providerType: 'vercel' },
  })

  if (!provider) throw new Error('Vercel provider not found')

  const providerExtended = await db.providerExtended.findFirst({
    where: {
      providerId: provider.id,
      extendedKey: 'token',
    },
  })

  const encryptedVercelTokenData = providerExtended?.extendedValue
  if (!encryptedVercelTokenData) throw new Error('Vercel token not found')

  const vercelToken = decrypt(encryptedVercelTokenData)

  const projectData = await createVercelProject(vercelToken, githubRepoName, fullName)

  await setVercelEnvs(vercelToken, projectData.id, {
    NODE_ENV: 'production',
    NEXT_PUBLIC_NODE_ENV: 'production',
    NEXT_PUBLIC_ROOT_NOTION_PAGE_ID: notionPageId,
    NEXT_PUBLIC_SUB: sub,
    NEXT_PUBLIC_AUTHOR: author,
    NEXT_PUBLIC_SITE_TITLE: siteTitle,
    NEXT_PUBLIC_SITE_DESCRIPTION: siteDescription,
  })

  const deployData = await triggerVercelDeployment(
    vercelToken,
    projectData.id,
    projectData.name,
    fullName,
    repoId,
    notionPageId
  )

  const deployTarget = await db.deployTarget.create({
    data: {
      targetId: deployData.project.id,
      targetName: deployData.project.name,
      targetUrl: `https://${deployData.url}`,
    },
  })

  await db.deployment.create({
    data: {
      deployTargetId: deployTarget.id,
      deployId: deployData.id,
      deployUrl: deployData.inspectorUrl,
      status: 'deploying',
    },
  })

  return {
    url: `https://${deployData.url}`,
    deployUrl: deployData.inspectorUrl,
    id: deployData.id,
    repoId,
    repoBranch: deployData.gitSource.ref,
    targetId: deployData.project.id,
    targetName: deployData.project.name,
  }
}
