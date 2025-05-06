import logger from '@/shared/lib/logger'

/**
 * Delete a Vercel project
 */
export async function deleteVercelProject(token: string, projectId: string) {
  const response = await fetch(`https://api.vercel.com/v8/projects/${projectId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to delete Vercel project: ${error}`)
  }

  if (response.status === 204) {
    return { message: 'No content returned — deletion successful' }
  }

  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch (error) {
    logger.log('error', 'Failed to parse Vercel deletion response:', { error })
    throw new Error('Invalid response received from Vercel project deletion.')
  }
}

/**
 * Create a Vercel project
 */
export async function createVercelProject(token: string, name: string, fullName: string) {
  const response = await fetch('https://api.vercel.com/v9/projects', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      framework: 'nextjs',
      gitRepository: { repo: fullName, type: 'github' },
    }),
  })

  const data = await response.json()
  if (!response.ok || !data.id) throw new Error('Failed to create Vercel project')
  return data
}

/**
 * Set environment variables for a Vercel project
 */
export async function setVercelEnvs(token: string, projectId: string, envs: Record<string, string>) {
  await fetch(`https://api.vercel.com/v10/projects/${projectId}/env?upsert=true`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
      Object.entries(envs).map(([key, value]) => ({
        key,
        value,
        type: 'plain',
        target: ['production'],
      }))
    ),
  })
}

/**
 * Trigger a deployment on Vercel
 */
export async function triggerVercelDeployment(token: string, projectId: string, projectName: string, fullName: string, repoId: number, notionPageId: string) {
  const response = await fetch('https://api.vercel.com/v13/deployments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: projectName,
      project: projectId,
      target: 'production',
      gitSource: {
        repo: fullName,
        repoId,
        type: 'github',
        ref: 'main',
      },
      meta: {
        NEXT_PUBLIC_ROOT_NOTION_PAGE_ID: notionPageId,
        NODE_ENV: 'production',
        NEXT_PUBLIC_NODE_ENV: 'production',
        NEXT_PUBLIC_AUTHOR: notionPageId,
      },
      alias: [`${projectName}.vercel.app`],
    }),
  })

  const data = await response.json()
  if (!response.ok || !data.url) throw new Error('Vercel deployment failed')
  return data
}
