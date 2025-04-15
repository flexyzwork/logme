export function GuideDialogTriggerButton() {
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

    window.open('/guide', '_blank', features)
  }

  return (
    <button onClick={handleClick} className="text-sm text-muted-foreground mt-1 underline">
      가입가이드
    </button>
  )
}
