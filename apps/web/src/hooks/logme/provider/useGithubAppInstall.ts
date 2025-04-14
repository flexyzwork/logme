import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/logme/authStore'
import { fetchGithubInstallationToken } from '@/services/logme/auth'
import { useCreateProviderExtended } from '@/hooks/logme/provider/useCreateProviderExtended'
import { storeProviderToken } from '@/lib/redis/tokenStore'
import { useSession } from 'next-auth/react'


export const useGithubAppInstall = () => {
  const { data: session } = useSession()
  const storeProviderExtended = useCreateProviderExtended()
  const [installedVercel, setInstalledVercel] = useState(false)
  const [isLogmeAppInstalled, setIsLogmeAppInstalled] = useState(false)
  const [vercelPopup, setVercelPopup] = useState<Window | null>(null)
  const [logmePopup, setLogmePopup] = useState<Window | null>(null)
  const [hasOpenedAppInstall, setHasOpenedAppInstall] = useState(false)

  const handleAppInstall = (app: 'vercel' | 'logme') => {

    const url =
      app === 'vercel' ? 'https://github.com/apps/vercel' : 'https://github.com/apps/flexyz-logme'
    const name = app === 'vercel' ? 'gitHub-app-vercel-install' : 'gitHub-app-logme-install'
    const popup = window.open(url, name, 'width=600,height=700,resizable,scrollbars')

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
        } else {
          setIsLogmeAppInstalled(true)
        }
      }
    }, 500)

    setHasOpenedAppInstall(true)
  }

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      
      if (event.data?.type === 'github_app_installed') {
        const installationId = event.data.installationId

        console.log('✅ 설치 완료! installation_id:', installationId)

        try {
          const userId = session?.user?.id


          const providerExtended = {
            providerType: 'github',
            extendedKey: 'logmeInstallationId',
            extendedValue: installationId,
          }
          await storeProviderExtended.mutateAsync(providerExtended)
          useAuthStore.getState().setGithubInstallationId(installationId)

          const token = await fetchGithubInstallationToken(installationId)
          console.log('✅ 설치 토큰:', token)
          storeProviderToken(userId!, 'githubApp', token)

          useAuthStore.getState().setGithubInstallationToken(token)

          setIsLogmeAppInstalled(true)
        } catch (err) {
          console.error('❌ 설치 토큰 저장 실패:', err)
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
