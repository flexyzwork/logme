import { Button } from '@/components/ui/button'

export interface GuideDialogTriggerButtonProps {
  path?: string
  label?: string
}

let guideWindow: Window | null = null

export function GuideDialogTriggerButton({
  path = '/guide/join',
  label = '가입가이드',
}: GuideDialogTriggerButtonProps) {
  const handleClick = () => {
    const screenW = window.innerWidth
    const screenH = window.outerHeight - 60
    const popupWidth = 500

    let features = ''
    if (screenW < 768) {
      features = `width=${screenW},height=${screenH},top=0,left=0`
    } else {
      const popupLeft = Math.max(0, window.screenX - popupWidth)
      const popupTop = window.screenY
      features = `width=${popupWidth},height=${screenH},top=${popupTop},left=${popupLeft}`
    }

    const url = new URL(path, window.location.origin)

    if (guideWindow && !guideWindow.closed) {
      const current = new URL(guideWindow.location.href)
      const requested = url

      // 해시 포함 전체 URL이 다르면 강제로 리로드
      if (current.href !== requested.href) {
        guideWindow.location.href = 'about:blank'
        setTimeout(() => {
          if (guideWindow) {
            guideWindow.location.href = requested.href
          }
        }, 50)
      }
    } else {
      guideWindow = window.open(url.href, '_blank', features)
    }
  }

  return (
    <Button onClick={handleClick} variant="outline">
      {label}
    </Button>
  )
}
