import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface NotionPage {
  id: string
  workspaceId?: string
  url?: string
}

interface GithubRepo {
  id: string
  name: string
  url?: string
}

interface VercelProject {
  id: string
  name: string
  url?: string
}

interface Site {
  id: string
  title?: string
  domain?: string
  isDeployed: boolean
  template?: string
  notionPage?: NotionPage
  githubRepo?: GithubRepo
  vercelProject?: VercelProject
  // userId?: string
}

interface SiteState {
  sites: Site[]
  createSite: (
    id: string,
    title?: string,
    domain?: string,
    isDeployed?: boolean,
    template?: string,
    notionPage?: NotionPage,
    githubRepo?: GithubRepo,
    vercelProject?: VercelProject,
    // userId?: string,
  ) => void
  updateSite: (siteId: string, updatedFields: Partial<Site>) => void
  removeSite: (siteId: string) => void
}

export const useSiteStore = create<SiteState>()(
  devtools(
    persist(
      (set) => ({
        sites: [],
        createSite: (
          id,
          title,
          domain,
          isDeployed,
          template,
          notionPage,
          githubRepo,
          vercelProject,
          // userId,
        ) => {
          const newSite: Site = {
            id,
            title: title || '',
            domain,
            isDeployed: isDeployed || false,
            template,
            notionPage: notionPage || undefined,
            githubRepo: githubRepo || undefined,
            vercelProject : vercelProject || undefined,
            // userId,
          }
          set((state: { sites: Site[] }) => ({
            sites: [...state.sites, newSite],
          }))
        },
        updateSite: (siteId, updatedFields) => {
          set((state) => ({
            sites: state.sites.map((site) =>
              site.id === siteId ? { ...site, ...updatedFields } : site,
            ),
          }))
        },
        removeSite: (siteId) => {
          set((state) => ({
            sites: state.sites.filter((site) => site.id !== siteId),
          }))
        },
      }),
      {
        name: 'site-storage',
        partialize: (state) => ({
          sites: state.sites.map((site) => {
            const { id, title, domain, isDeployed, notionPage, githubRepo, vercelProject } = site
            const partialSite: Partial<Site> = {
              id,
              title,
              domain,
              isDeployed,
              template: undefined,
              notionPage,
              githubRepo,
              vercelProject,
              // userId: undefined,
            }
            if (site.template) partialSite.template = site.template
            if (site.notionPage) partialSite.notionPage = site.notionPage
            if (site.githubRepo) partialSite.githubRepo = site.githubRepo
            if (site.vercelProject) partialSite.vercelProject = site.vercelProject
            // if (site.userId) partialSite.userId = site.userId

            return partialSite
          }),
        }),
      },
    ),
    { name: 'site-storage' },
  ),
)
