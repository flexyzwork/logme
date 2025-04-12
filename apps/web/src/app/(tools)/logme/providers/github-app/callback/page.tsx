'use client'

import { useEffect } from 'react'

export default function GithubCallback() {
  useEffect(() => {
    const installationId = new URLSearchParams(window.location.search).get('installation_id')

    if (window.opener && installationId) {
      window.opener.postMessage(
        {
          type: 'github_app_installed',
          installationId,
        },
        window.origin,
      )

      window.close()
    }
  }, [])

  return <p>설치 완료 중... 창이 곧 닫힙니다.</p>
}
