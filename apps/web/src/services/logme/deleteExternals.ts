import { Octokit } from 'octokit'

/**
 * Vercel 프로젝트 삭제
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
    throw new Error(`Vercel 프로젝트 삭제 실패: ${error}`)
  }

  if (response.status === 204) {
    return { message: 'No content returned — deletion successful' }
  }

  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch (err) {
    console.error('Vercel 삭제 응답 파싱 실패:', text)
    throw new Error('Vercel 프로젝트 삭제 응답이 올바르지 않습니다.')
  }
}

/**
 * GitHub 저장소 삭제
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
    console.error('❌ GitHub 저장소 삭제 실패 전체 응답:', error)
  
    const status = error?.status || error?.response?.status
    const data = error?.response?.data || error
  
    const message =
      data?.message || error?.message || '알 수 없는 오류로 삭제에 실패했습니다.'
  
    throw new Error(`GitHub 저장소 삭제 실패 (${status}): ${message}`)
  }
}