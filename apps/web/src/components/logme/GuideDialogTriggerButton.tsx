// Removed Dialog and Accordion imports as we now use a native popup
import React from 'react'

export function GuideDialogTriggerButton() {
  const handleClick = () => {
    const screenW = window.innerWidth
    const screenH = window.innerHeight
    const mainW = document.querySelector('main')?.clientWidth || screenW
    const leftSpace = (screenW - mainW) / 2

    let features = ''
    if (screenW < 768) {
      features = `width=${screenW},height=${screenH},top=0,left=0`
    } else if (leftSpace > 300) {
      features = `width=300,height=${screenH},top=0,left=${leftSpace - 300}`
    } else {
      features = `width=360,height=${screenH},top=0,left=0`
    }

    window.open('/guide', '_blank', features)
  }

  return (
    <button onClick={handleClick} className="text-sm text-muted-foreground mt-1 underline">
      연결가이드
    </button>
  )
}
