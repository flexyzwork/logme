/* eslint-disable @typescript-eslint/no-explicit-any */
import logger from '@/shared/lib/logger'
import { Octokit } from 'octokit'

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
