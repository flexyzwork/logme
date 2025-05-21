'use client'

import { useEffect } from 'react'

/**
 * ud074ub77cuc774uc5b8ud2b8 uc0acuc774ub4dcuc5d0uc11cub9cc AdSense uc2a4ud06cub9bdud2b8ub97c ub85cub4dcud558ub294 ucef4ud3ecub10cud2b8
 */
export default function AdSenseScript() {
  const isAdsEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true'
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

  useEffect(() => {
    // uad11uace0uac00 ud65cuc131ud654ub418uc5b4 uc788uace0 ud074ub77cuc774uc5b8ud2b8 IDuac00 uc788uc744 ub54cub9cc uc2a4ud06cub9bdud2b8 ub85cub4dc
    if (isAdsEnabled && clientId && typeof window !== 'undefined') {
      // uc2a4ud06cub9bdud2b8uac00 uc774ubbf8 ub85cub4dcub418uc5c8ub294uc9c0 ud655uc778
      if (!document.querySelector(`script[src*='adsbygoogle'][data-loaded='true']`)) {
        const script = document.createElement('script')
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`
        script.async = true
        script.crossOrigin = 'anonymous'
        script.dataset.loaded = 'true'  // ub85cub4dc uc5ecubd80 ucd94uc801uc744 uc704ud55c uc18duc131
        
        // uc2a4ud06cub9bdud2b8 ub85cub4dc uc644ub8cc uc2dc ucf58uc194uc5d0 uba54uc2dcuc9c0 ucd9cub825
        script.onload = () => {
          console.log('AdSense uc2a4ud06cub9bdud2b8uac00 uc131uacf5uc801uc73cub85c ub85cub4dcub418uc5c8uc2b5ub2c8ub2e4.')
        }
        
        // uc624ub958 ucc98ub9ac
        script.onerror = (error) => {
          console.error('AdSense uc2a4ud06cub9bdud2b8 ub85cub4dc uc911 uc624ub958 ubc1cuc0dd:', error)
        }
        
        document.head.appendChild(script)
      }
    }
  }, [isAdsEnabled, clientId])

  // uc774 ucef4ud3ecub10cud2b8ub294 UIub97c ub80cub354ub9c1ud558uc9c0 uc54auc74c
  return null
}
