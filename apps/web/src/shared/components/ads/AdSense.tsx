/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect } from 'react'

export type AdSenseProps = {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  style?: React.CSSProperties
  responsive?: boolean
  className?: string
}

export default function AdSense({
  slot,
  format = 'auto',
  style = {},
  responsive = true,
  className = '',
}: AdSenseProps) {
  // Check if ads are enabled via environment variable
  const isAdsEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true'
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID
  
  // 심사 모드 (클라이언트 ID 없이 광고 위치만 표시할지 여부)
  const isReviewMode = isAdsEnabled && !clientId

  useEffect(() => {
    // Only load ads if enabled and client ID exists
    if (isAdsEnabled && clientId && window) {
      try {
        // Push the command to Google AdSense to update ads
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      } catch (error) {
        console.error('AdSense error:', error)
      }
    }
  }, [isAdsEnabled, clientId])

  // 광고 기능이 완전히 비활성화된 경우에만 표시하지 않음
  if (!isAdsEnabled) {
    return null
  }

  // 클라이언트 ID가 없는 심사 모드일 경우 더미 광고 컨테이너 표시
  if (isReviewMode) {
    return (
      <div 
        className={`ad-container ${className}`}
        style={{
          backgroundColor: '#f0f0f0',
          minHeight: format === 'rectangle' ? '250px' : '90px',
          minWidth: format === 'rectangle' ? '300px' : '100%',
          margin: '10px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px dashed #ccc',
          ...style,
        }}
      >
        <p style={{ color: '#666', textAlign: 'center', padding: '10px' }}>
          광고가 표시될 영역 (슬롯: {slot})
        </p>
      </div>
    )
  }
  
  // 실제 AdSense 광고 (클라이언트 ID가 있을 때)
  return (
    <div className={`ad-container ${className}`}>
      <ins
        className={`adsbygoogle ${responsive ? 'adsbygoogle-responsive' : ''}`}
        style={{
          display: 'block',
          overflow: 'hidden',
          ...style,
        }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  )
}
