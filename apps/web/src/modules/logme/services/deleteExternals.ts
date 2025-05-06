/* eslint-disable @typescript-eslint/no-explicit-any */
import logger from '@/shared/lib/logger'
import { Octokit } from 'octokit'

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
 * Delete a GitHub repository
 */
export async function deleteGithubRepo({
  installationToken,
  owner,
  repo,
}: {
  installationToken: string
  owner: string
  repo: string
}) {
  const octokit = new Octokit({ auth: installationToken })

  try {
    const res = await octokit.rest.repos.delete({
      owner,
      repo,
    })
    return res
  } catch (error: any) {
    logger.log('error', '❌ Failed to delete GitHub repository. Full response:', { error })

    const status = error?.status || error?.response?.status
    const data = error?.response?.data || error

    const message = data?.message || error?.message || 'Deletion failed due to an unknown error.'

    throw new Error(`Failed to delete GitHub repository (${status}): ${message}`)
  }
}
