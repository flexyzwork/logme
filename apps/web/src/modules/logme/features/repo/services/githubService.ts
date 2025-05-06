/* eslint-disable @typescript-eslint/no-explicit-any */
import logger from '@/shared/lib/logger'
import { Octokit } from 'octokit'

export const fetchGithubInstallationToken = async (installationId: number) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000' // 또는 서버의 실제 baseURL
  const res = await fetch(`${baseUrl}/api/logme/providers/github`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ installationId }),
  })

  const data = await res.json()

  if (!res.ok || !data.token) {
    throw new Error(data?.error || 'Failed to fetch GitHub App installation token.')
  }

  return data.token as string
}

export async function cloneFromTemplateRepo({
  githubInstallationId,
  templateOwner,
  templateRepo,
  githubOwner,
  githubRepoName,
}: {
  githubInstallationId: number
  templateOwner: string
  templateRepo: string
  githubOwner: string
  githubRepoName: string
}) {
  const githubInstallationToken = await fetchGithubInstallationToken(githubInstallationId)

  const githubCreateRes = await fetch(
    `https://api.github.com/repos/${templateOwner}/${templateRepo}/generate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${githubInstallationToken}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        owner: githubOwner,
        name: githubRepoName,
        description: 'Created by logme repository',
        include_all_branches: false,
        private: false,
      }),
    }
  )

  const githubCreateData = await githubCreateRes.json()

  if (!githubCreateRes.ok || !githubCreateData.full_name || !githubCreateData.id) {
    logger.log('error', '❌ Failed to generate GitHub repository:', githubCreateData)
    throw new Error('Failed to clone GitHub repository')
  }

  return {
    fullName: githubCreateData.full_name,
    repoId: githubCreateData.id,
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
