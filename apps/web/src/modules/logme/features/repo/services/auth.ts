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
