'use client'

import { useEffect, useState } from 'react'

export default function OpenInBrowserPage() {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other')

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(ua)) {
      setPlatform('ios')
    } else if (/android/.test(ua)) {
      setPlatform('android')
    }
  }, [])

  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>⚠️ Sign-in not supported here</h2>
      <p>Google sign-in is blocked in this in-app browser.</p>

      {platform === 'ios' && (
        <>
          <p><strong>Please open this page in Safari.</strong></p>
          <p>Tap the share button (⬆️) and choose <strong>“Open in Safari”</strong> or <strong>“Open in browser”</strong>.</p>
        </>
      )}

      {platform === 'android' && (
        <>
          <p><strong>Please open this page in Chrome.</strong></p>
          <p>Tap the <strong>⋮ menu</strong> at the top right and choose <strong>“Open in Chrome”</strong> or <strong>“Open in browser”</strong>.</p>
        </>
      )}

      {platform === 'other' && (
        <p><strong>Please open this page in your external browser.</strong></p>
      )}
    </main>
  )
}