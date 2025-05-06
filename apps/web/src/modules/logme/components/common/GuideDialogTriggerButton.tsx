import { Button } from '@/shared/components/ui/button'

export interface GuideDialogTriggerButtonProps {
  path?: string
  label?: string
}

let guideWindow: Window | null = null

export function GuideDialogTriggerButton({
  path = '/guide/join',
  label = 'Sign Up Guide',
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

      // If the full URL including hash differs, force reload
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
