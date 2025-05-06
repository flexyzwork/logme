import { useState } from 'react'

export const useSiteBuilderUI = () => {
  const [isCheckingCopy, setIsCheckingCopy] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)
  const [hasCopiedTemplate, setIsCopyComplete] = useState(false)
  const [notionPopup, setNotionPopup] = useState<Window | null>(null)
  const [isCheckingPublic, setIsCheckingPublic] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  return {
    isCheckingCopy,
    setIsCheckingCopy,
    hasChecked,
    setHasChecked,
    hasCopiedTemplate,
    setIsCopyComplete,
    notionPopup,
    setNotionPopup,
    isCheckingPublic,
    setIsCheckingPublic,
    isDeploying,
    setIsDeploying,
  }
}
