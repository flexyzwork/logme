/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Image from 'next/image'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/shared/components/ui/alert-dialog'
import { useRouter } from 'next/navigation'
import ShareButton from '@/modules/logme/components/common/ShareButton'
import { useDeleteSite } from '@/modules/logme/features/site/hooks/useDeleteSite'
import { useFetchSites } from '@/modules/logme/features/site/hooks/useFetchSites'
import { useUpdateSite } from '@/modules/logme/features/site/hooks/useUpdateSite'
import { Button } from '@/shared/components/ui/button'

export default function LogmeDashboard() {
  const { data: sites, isLoading, error } = useFetchSites()
  const deleteSite = useDeleteSite()
  const updateSite = useUpdateSite()
  const [editingSite, setEditingSite] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [editingDescription, setEditingDescription] = useState('')
  const router = useRouter()

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">Error: {error.message}</div>
      ) : sites && sites.length > 0 ? (
        <>
          <div className="flex items-center justify-end mb-6">
            <Button className="text-sm mt-1" onClick={() => router.push('/logme')}>
              + Create new blog
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {sites.map((site: any) => (
              <div
                key={site.id}
                className="border rounded-md p-4 shadow flex flex-col sm:flex-row w-full"
              >
                <Image
                  src={site.template?.thumbnailUrl ?? '/placeholder.png'}
                  alt="Site preview"
                  width={400}
                  height={300}
                  className="w-full sm:w-80 rounded border object-cover"
                />
                <div className="sm:ml-10 mt-4 sm:mt-0 flex-1">
                  {editingSite === site.id ? (
                    <>
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        placeholder="Site title"
                        className="w-full p-1 border rounded mb-2"
                      />
                      <textarea
                        value={editingDescription}
                        onChange={(e) => setEditingDescription(e.target.value)}
                        placeholder="Site description"
                        className="w-full p-1 border rounded mb-2"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            updateSite.mutate({
                              id: site.id,
                              siteTitle: editingTitle,
                              siteDescription: editingDescription,
                            })
                            setEditingSite(null)
                          }}
                        >
                          Confirm
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingSite(null)}>
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="font-semibold text-lg">{site.siteTitle}</h2>
                      {site.siteDescription && (
                        <p className="mt-1 text-sm text-gray-600">{site.siteDescription}</p>
                      )}
                    </>
                  )}

                  {editingSite !== site.id && (
                    <>
                      <p className="mt-2 text-sm">
                        Status: {site.status === 'published' ? 'Published' : 'Incomplete'}
                      </p>
                      {site.template && (
                        <p className="mt-1 text-sm">Template: {site.template.templateTitle}</p>
                      )}
                      {site.domainVerifications?.length > 0 ? (
                        <div className="mt-1 text-sm">
                          Subdomain:{' '}
                          <a
                            href={`https://${site.domainVerifications[0].subdomain}`}
                            className="text-blue-500 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {site.domainVerifications[0].subdomain}
                          </a>{' '}
                          {site.domainVerifications[0].verified ? ` Connected` : '⏳ Pending'}
                        </div>
                      ) : (
                        <div className="mt-1 text-sm text-red-500">
                          ❌ Failed to generate subdomain
                        </div>
                      )}
                      {site.domainType === 'sub' && site.sub && (
                        <p className="mt-1 text-sm">
                          Deployed URL:{' '}
                          <a
                            href={`https://logme-${site.sub}.vercel.app`}
                            className="text-blue-500 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {`logme-${site.sub}.vercel.app`}
                          </a>
                        </p>
                      )}

                      <details className="mt-2 text-sm">
                        <summary className="cursor-pointer text-blue-500">Details</summary>
                        <div className="mt-2 space-y-1">
                          {site.contentSource && (
                            <p>
                              Notion Content:{' '}
                              <a
                                href={site.contentSource.sourceUrl}
                                className="text-blue-500 underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {site.contentSource.sourceId}
                              </a>
                            </p>
                          )}
                          {site.repo && (
                            <p>
                              GitHub Repository:{' '}
                              <a
                                href={site.repo.repoUrl}
                                className="text-blue-500 underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {site.repo.repoName}
                              </a>
                            </p>
                          )}
                          {site.deployTarget?.deployments[0]?.deployUrl && (
                            <p>
                              Vercel Deployment:{' '}
                              <a
                                href={site.deployTarget.deployments[0]?.deployUrl}
                                className="text-blue-500 underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {site.deployTarget.targetName}
                              </a>
                            </p>
                          )}
                        </div>
                      </details>

                      <div className="mt-4 flex justify-end-safe gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setEditingSite(site.id)
                            setEditingTitle(site.siteTitle || '')
                            setEditingDescription(site.siteDescription || '')
                          }}
                        >
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure you want to delete this site?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. All related GitHub repositories,
                                Vercel deployments, and data will be permanently removed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteSite.mutate(site.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <ShareButton
                          url={
                            site.domainVerifications?.[0]?.verified
                              ? `https://${site.domainVerifications[0].subdomain}`
                              : `https://logme-${site.sub}.vercel.app`
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-end">
            <Button className="text-sm mt-1" onClick={() => router.push('/logme')}>
              + Create new blog
            </Button>
          </div>
          <div className="border rounded-md p-6 text-center text-sm text-muted-foreground">
            No sites created yet.
          </div>
        </div>
      )}
    </div>
  )
}
