import { Button } from '@/components/ui/button'

export interface GuideDialogTriggerButtonProps {
  path?: string
  label?: string
}

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
    console.log('🔗 URL:', url.href)
    window.open(url.href, '_blank', features)
  }

  return (
    <Button onClick={handleClick} variant="outline">
      {label}
    </Button>
  )
}
