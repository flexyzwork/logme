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
