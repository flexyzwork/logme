'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useBuilderStore } from '@/modules/logme/features/site/stores/builderStore'
import { useAuthStore } from '@/shared/stores'
import { useSession } from 'next-auth/react'
import { encrypt } from '@/shared/lib/crypto'
import { trackEvent } from '@/shared/lib/tracking'
import logger from '@/shared/lib/logger'
import { useCreateProvider } from '@/modules/logme/features/provider/hooks/useCreateProvider'
import { ProviderType } from '@repo/types'
import { useCreateContentSource } from '@/modules/logme/features/contentSource/hooks/useCreateContentSource'
import { useCreateProviderExtended } from '@/modules/logme/features/provider/hooks/useCreateProviderExtended'
import { useUpdateSite } from '@/modules/logme/features/site/hooks/useUpdateSite'

export default function NotionCallbackPage() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()
  const {
    siteId,
    templateId,
    isNotionFetching,
    notionLastProcessedCode,
    setBuilderStep,
    setNotionPageId,
    setUserId,
    setSiteId,
    setNotionLastProcessedCode,
    setIsNotionFetching,
  } = useBuilderStore()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { notion } = useAuthStore()
  const { mutateAsync: storeProviderUser } = useCreateProvider()
  const { mutateAsync: createContentSourceDB } = useCreateContentSource()
  const { mutateAsync: updateSiteDB } = useUpdateSite()
  const storeProviderExtended = useCreateProviderExtended()
  const executedRef = useRef(false)

  useEffect(() => {
    if (executedRef.current || status !== 'authenticated') return
    executedRef.current = true

    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code) {
      setError('Authorization code is missing')
      setLoading(false)
      return
    }

    if (!state || state !== notion?.authState) {
      console.warn('❌ Invalid authentication request (state missing or mismatch)')
      setError('Invalid authentication request (state mismatch)')
      setLoading(false)
      logger.log('warn', '❌ Invalid authentication request (state mismatch)', {
        state,
        notionAuthState: notion?.authState,
        sessionUserId: session?.user.id,
      })
      return
    }

    if (isNotionFetching || notionLastProcessedCode === code) {
      setLoading(false)
      return
    }

    const fetchToken = async () => {
      let currentUserId = session.user?.id

      try {
        router.replace('/logme/builder', { scroll: false })
        setIsNotionFetching(true)
        setBuilderStep(1)

        const response = await fetch('/api/logme/providers/notion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, state }),
        })

        const data = await response.json()

        logger.log('info', 'Notion auth response:', { data })

        if (data.access_token && data.duplicated_template_id) {
          const accessToken = data.access_token

          const providerUser = {
            providerType: ProviderType.notion,
            providerUserId: data.owner?.user?.id ?? '',
            name: data.owner?.user?.name ?? 'Unknown',
            email: data.owner?.user?.person?.email ?? '',
            avatarUrl: data.owner?.user?.avatar_url ?? '',
            userId: currentUserId,
          }

          const res = await storeProviderUser(providerUser)
          const newUserId = res.userId

          if (!currentUserId || currentUserId !== newUserId) {
            currentUserId = newUserId
          }

          const encryptedToken = encrypt(accessToken)

          await storeProviderExtended.mutateAsync({
            providerType: 'notion',
            templateId: templateId ?? '',
            extendedKey: 'token',
            extendedValue: encryptedToken,
          })

          logger.log('info', 'Notion authentication complete:', {
            userId: currentUserId,
            providerUserId: data.owner?.user?.id,
            accessToken: encryptedToken,
          })
          await trackEvent({
            userId: session?.user?.id,
            event: 'notion_connected',
            meta: { pageId: data.duplicated_template_id, method: 'oauth' },
          })

          setUserId(currentUserId)
          setNotionPageId(data.duplicated_template_id)
          setNotionLastProcessedCode(code)

          const contentSourceData = {
            sourceId: data.duplicated_template_id,
          }
          const contentSource = await createContentSourceDB(contentSourceData)
          logger.log('info', 'Content Source created:', contentSource)

          if (siteId) {
            await updateSiteDB({
              id: siteId,
              contentSourceId: contentSource.id,
            })
            logger.log('info', 'Site update complete:', {
              siteId,
              contentSourceId: contentSource.id,
            })
          } else {
            setError('Failed to get site ID')
            logger.log('error', '❌ Site ID is missing.')
          }
        } else {
          setError('Failed to get access token or template ID')
        }
      } catch (error) {
        logger.log('error', '❌ Error during Notion authentication:', { error })
        setError('Internal server error')
      } finally {
        setIsNotionFetching(false)
        setLoading(false)
      }
    }

    fetchToken()
  }, [
    session,
    status,
    searchParams,
    router,
    setBuilderStep,
    isNotionFetching,
    setIsNotionFetching,
    setNotionLastProcessedCode,
    notionLastProcessedCode,
    setSiteId,
    storeProviderUser,
    setUserId,
    notion?.authState,
    createContentSourceDB,
    siteId,
    updateSiteDB,
    setNotionPageId,
    storeProviderExtended,
    templateId,
  ])

  if (status === 'loading' || loading) return <p>Loading...</p>
  if (!session) return <p>Sign-in required</p>
  if (error) return <p>Error: {error}</p>

  return null
}
