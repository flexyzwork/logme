/* eslint-disable @typescript-eslint/no-explicit-any */


export async function requestDeployment({
  sub,
  siteTitle,
  siteDescription,
  author,
  notionPageId,
  githubInstallationId,
  templateOwner,
  templateRepo,
  githubOwner,
  githubRepoName,
  siteId,
}: {
  sub: string
  siteTitle?: string
  siteDescription?: string
  author?: string
  notionPageId: string
  githubInstallationId: number
  templateOwner: string
  templateRepo: string
  githubOwner: string
  githubRepoName: string
  siteId?: string
}) {
  const response = await fetch('/api/logme/deployments', {
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
      githubRepoName,
      siteId,
    }),
  })

  return await response.json()
}

export async function syncRepoAndTarget({
  data,
  githubOwner,
  sub,
  createRepo,
  // createDeployTarget,
}: {
  data: any
  githubOwner: string
  sub: string
  createRepo: any
  // createDeployTarget: any
}) {
  const repo = await createRepo({
    repoId: `${data.repoId}`,
    repoName: `logme-${sub}`,
    repoUrl: `https://github.com/${githubOwner}/logme-${sub}`,
    repoOwner: githubOwner,
    repoBranch: data.repoBranch,
  })

  // const deployTarget = await createDeployTarget({
  //   targetId: data.targetId,
  //   targetName: data.targetName,
  //   targetUrl: data.url,
  // })

  // return { repo, deployTarget }
  return { repo }
}

export async function updateSiteWithDeployment({
  siteId,
  repoId,
  // deployTargetId,
  updateSite,
}: {
  siteId: string
  repoId: string
  // deployTargetId: string
  updateSite: any
}) {
  await updateSite({
    id: siteId,
    repoId,
    // deployTargetId,
    status: 'draft',
  })
}