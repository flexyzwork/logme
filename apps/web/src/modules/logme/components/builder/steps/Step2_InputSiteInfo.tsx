'use client'

import logger from '@/shared/lib/logger'
import { SiteInfoForm } from '@/modules/logme/components/builder/forms/SiteInfoForm'
import { RESERVED_SUBDOMAINS } from '@/modules/logme/features/site/constants/reserved'
import { useSiteBuilderUI } from '@/modules/logme/features/site/hooks/useSiteBuilderUI'
import { useUpdateSite } from '@/modules/logme/features/site/hooks/useUpdateSite'
import { useBuilderStore } from '@/modules/logme/features/site/stores/builderStore'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useDeploymentActions } from '@/modules/logme/features/deployment/hooks/useDeploymentActions'

export default function Step2_InputSiteInfo() {
  const { mutateAsync: updateSiteDB } = useUpdateSite()
  const { startDeploy } = useDeploymentActions()
  const {
    siteId,
    setBuilderStep,
    setDeployUrl,
    setSub,
    setGitRepoUrl,
    setSiteTitle,
    setSiteDescription,
  } = useBuilderStore()
  const { data: session } = useSession()
  const { setIsDeploying } = useSiteBuilderUI()

  const [siteInfo, setSiteInfo] = useState({
    author: session?.user?.name || '',
    title: '',
    description: '',
    sub: '',
  })

  const [isSaving, setIsSaving] = useState(false)

  const checkSubAvailable = async (sub: string): Promise<boolean> => {
    const isReserved = RESERVED_SUBDOMAINS.some((word) => sub.toLowerCase().startsWith(word))
    if (isReserved) {
      alert('❌ This subdomain is reserved and cannot be used.')
      return false
    }
    const res = await fetch(`/api/domains/check-sub?sub=${sub}`)
    const json = await res.json()
    if (!res.ok || json.exists) {
      alert('❌ This subdomain is already in use.')
      return false
    }
    return true
  }

  const handleChange = (field: 'author' | 'title' | 'description' | 'sub', value: string) => {
    setSiteInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    const userId = session?.user?.id
    const userName = session?.user?.name
    if (!userId) {
      alert('❌ Sign-in required.')
      return
    }
    if (!(await checkSubAvailable(siteInfo.sub))) return

    setIsSaving(true)

    if (siteId) {
      await updateSiteDB({
        id: siteId,
        sub: siteInfo.sub,
        siteTitle: siteInfo.title,
        siteDescription: siteInfo.description,
      })
      logger.log('info', 'Site updated:', {
        sub: siteInfo.sub,
        title: siteInfo.title,
        description: siteInfo.description,
      })
      startDeploy(
        {
          sub: siteInfo.sub,
          siteTitle: siteInfo.title,
          siteDescription: siteInfo.description,
          author: userName || '',
        },
        () => setIsDeploying(true),
        (deployUrl, gitRepoUrl) => {
          setDeployUrl(deployUrl)
          setSub(siteInfo.sub)
          setSiteTitle(siteInfo.title)
          setSiteDescription(siteInfo.description)
          setGitRepoUrl(gitRepoUrl)
          logger.log('info', 'Deploying site...', siteInfo)
          setIsSaving(false)
          setBuilderStep(4)
        }
      )
    } else {
      logger.log('error', '❌ Site ID is missing.')
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center text-gray-700 text-sm">
        🎉 Your Notion template has been published. <br />
        Please enter your site information. <br />
        Click Save to deploy to Vercel.
      </p>
      <SiteInfoForm
        author={siteInfo.author}
        title={siteInfo.title}
        description={siteInfo.description}
        sub={siteInfo.sub}
        onChange={handleChange}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  )
}
