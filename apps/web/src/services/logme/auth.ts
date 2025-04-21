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
    throw new Error(data?.error || 'GitHub App 연결 토큰을 받아올 수 없습니다.')
  }

  return data.token as string
}
