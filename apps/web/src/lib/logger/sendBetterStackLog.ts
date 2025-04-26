export async function sendBetterStackLog(
  level: string,
  message: string,
  meta?: Record<string, any>
) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

    await fetch(`${baseUrl}/api/internal/log-betterstack`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level, message, meta }),
    })
  } catch (error) {
    console.error('로컬 로그 전송 실패:', error)
  }
}
