'use client'

import { useEffect } from 'react'

export default function GithubCallbackPage() {
  useEffect(() => {
    const installationId = new URLSearchParams(window.location.search).get('installation_id')

    if (window.opener && installationId) {
      window.opener.postMessage(
        {
          type: 'github_app_installed',
          installationId,
        },
        window.origin
      )

      window.close()
    }
  }, [])

  return <p>Connecting... This window will close shortly.</p>
}
