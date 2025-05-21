/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useRef } from 'react'

export type AdSenseProps = {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  style?: React.CSSProperties
  responsive?: boolean
  className?: string
}

/**
 * AdSense 광고를 표시하는 컴포넌트
 * 참고: 광고 스크립트 로딩은 AdSenseScript 컴포넌트에서 처리합니다.
 */
export default function AdSense({
  slot,
  format = 'auto',
  style = {},
  responsive = true,
  className = '',
}: AdSenseProps) {
  // 환경 변수 체크
  const isAdsEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true'
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID
  
  // 광고 컨테이너 참조
  const adContainerRef = useRef<HTMLDivElement>(null)
  
  // 심사 모드 (클라이언트 ID 없이 광고 위치만 표시할지 여부)
  const isReviewMode = isAdsEnabled && !clientId

  useEffect(() => {
    // 광고가 비활성화되었거나 심사 모드인 경우 처리하지 않음
    if (!isAdsEnabled || isReviewMode) return;
    
    // 광고를 푸시하기 전에 지연시간을 두어 DOM이 준비되도록 함
    const adTimer = setTimeout(() => {
      try {
        // 광고 컨테이너가 준비되었고 크기가 유효한지 확인
        if (adContainerRef.current && adContainerRef.current.clientWidth > 0) {
          // window.adsbygoogle가 준비되었는지 확인
          if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
            // 광고 푸시
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
            console.log(`AdSense 광고 슬롯(${slot})이 푸시되었습니다.`)
          } else {
            console.warn('AdSense 스크립트가 아직 로드되지 않았습니다.')
          }
        } else {
          console.warn(`광고 컨테이너(슬롯:${slot})가 보이지 않거나 크기가 0입니다.`)
        }
      } catch (error) {
        console.error('AdSense 광고 푸시 중 오류:', error)
      }
    }, 1000); // 1초 지연으로 스크립트와 DOM이 모두 준비되도록 함
    
    return () => clearTimeout(adTimer);
  }, [isAdsEnabled, isReviewMode, slot])

  // 광고 기능이 완전히 비활성화된 경우에만 표시하지 않음
  if (!isAdsEnabled) {
    return null
  }

  // 광고 크기 기본값 설정
  const defaultHeight = format === 'rectangle' ? '250px' : '90px';
  const defaultWidth = format === 'rectangle' ? '300px' : '100%';
  
  // 클라이언트 ID가 없는 심사 모드일 경우 더미 광고 컨테이너 표시
  if (isReviewMode) {
    return (
      <div 
        className={`ad-container ${className}`}
        style={{
          backgroundColor: '#f0f0f0',
          minHeight: defaultHeight,
          width: defaultWidth,
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
    <div 
      ref={adContainerRef}
      className={`ad-container ${className}`} 
      style={{
        minHeight: defaultHeight,
        width: defaultWidth,
        margin: '10px 0',
        ...style
      }}
    >
      <ins
        className={`adsbygoogle ${responsive ? 'adsbygoogle-responsive' : ''}`}
        style={{
          display: 'block',
          width: defaultWidth,
          height: defaultHeight,
          overflow: 'hidden',
        }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  )
}
