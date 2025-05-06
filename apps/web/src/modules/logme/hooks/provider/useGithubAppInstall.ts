import { useEffect, useState, useRef } from 'react'
import { fetchGithubInstallationToken } from '@/modules/logme/services/auth'
import logger from '@/shared/lib/logger'
import { useCreateProviderExtended } from '@/modules/logme/hooks/provider/useCreateProviderExtended'

export const useGithubAppInstall = () => {
  const storeProviderExtended = useCreateProviderExtended()
  const [installedVercel, setInstalledVercel] = useState(false)
  const [isLogmeAppInstalled, setIsLogmeAppInstalled] = useState(false)
  const [vercelPopup, setVercelPopup] = useState<Window | null>(null)
  const [logmePopup, setLogmePopup] = useState<Window | null>(null)
  const [hasOpenedAppInstall, setHasOpenedAppInstall] = useState(false)
  const isFetching = useRef(false)

  const handleAppInstall = (app: 'vercel' | 'logme') => {
    const isProduction = process.env.NODE_ENV === 'production'

    const url =
      app === 'vercel'
        ? 'https://github.com/apps/vercel'
        : isProduction
          ? 'https://github.com/apps/logme-dev'
          : 'https://github.com/apps/logme-dev-local'

    const name = app === 'vercel' ? 'gitHub-app-vercel-install' : 'gitHub-app-logme-dev-install'

    const popupWidth = 600
    const popupHeight = 700

    const guideLeft = Math.max(0, window.screenX - 500) // assuming guide is 500px wide on left
    const popupLeft = guideLeft + 500 + 10 // 10px spacing to the right of guide
    const popupTop = window.screenY

    const features = `width=${popupWidth},height=${popupHeight},top=${popupTop},left=${popupLeft},resizable,scrollbars`

    const popup = window.open(url, name, features)

    if (app === 'vercel') {
      setVercelPopup(popup)
    } else {
      setLogmePopup(popup)
    }

    const interval = setInterval(async () => {
      if (popup?.closed) {
        clearInterval(interval)
        if (app === 'vercel') {
          setInstalledVercel(true)
          const providerExtended = {
            providerType: 'github',
            extendedKey: 'vercelInstallation',
            extendedValue: 'true',
          }
          await storeProviderExtended.mutateAsync(providerExtended)
        }
      }
    }, 500)

    setHasOpenedAppInstall(true)
  }

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'github_app_installed') {
        const installationId = event.data.installationId

        logger.log('info', 'github_app.installation_success', {
          installationId,
        })

        if (isFetching.current) return
        isFetching.current = true

        try {
          const providerExtended = {
            providerType: 'github',
            extendedKey: 'logmeInstallationId',
            extendedValue: installationId,
          }
          await storeProviderExtended.mutateAsync(providerExtended)

          await fetchGithubInstallationToken(installationId)

          setIsLogmeAppInstalled(true)
        } catch (error) {
          logger.log('error', 'github_app.token_save_failed', {
            error,
            context: 'useGithubAppInstall',
          })
        } finally {
          isFetching.current = false
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [storeProviderExtended])

  return {
    handleAppInstall,
    installedVercel,
    isLogmeAppInstalled,
    setInstalledVercel,
    setIsLogmeAppInstalled,
    vercelPopup,
    logmePopup,
    hasOpenedAppInstall,
  }
}
