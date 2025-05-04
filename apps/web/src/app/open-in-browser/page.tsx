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
      <h2>⚠️ 로그인할 수 없습니다</h2>
      <p>현재 사용 중인 앱에서는 Google 로그인이 차단되어 있어요.</p>

      {platform === 'ios' && (
        <>
          <p><strong>Safari에서 다시 열어주세요.</strong></p>
          <p>공유 버튼(⬆️)을 누른 뒤 <strong>“Safari에서 열기”</strong> 또는 <strong>“브라우저로 열기”</strong>를 선택해 주세요.</p>
        </>
      )}

      {platform === 'android' && (
        <>
          <p><strong>Chrome에서 다시 열어주세요.</strong></p>
          <p>오른쪽 위 <strong>⋮ 메뉴</strong>를 누른 뒤 <strong>“Chrome에서 열기”</strong> 또는 <strong>“브라우저로 열기”</strong>를 선택하세요.</p>
        </>
      )}

      {platform === 'other' && (
        <p><strong>외부 브라우저에서 다시 열어주세요.</strong></p>
      )}
    </main>
  )
}