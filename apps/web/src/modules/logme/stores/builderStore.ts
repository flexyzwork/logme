import logger from '@/shared/lib/logger'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface BuilderState {
  step: number
  isNotionFetching: boolean
  userId: string | null
  notionLastProcessedCode: string | null
  notionPageId: string | null
  siteId: string | null
  siteTitle: string | null
  siteDescription: string | null
  templateId: string | null
  deployUrl: string | null
  sub: string | null
  gitRepoUrl: string | null

  setBuilderStep: (step: number) => void
  setIsNotionFetching: (status: boolean) => void
  setNotionLastProcessedCode: (code: string) => void
  setNotionPageId: (id: string) => void
  setSiteId: (id: string) => void
  setSiteTitle: (title: string) => void
  setSiteDescription: (description: string) => void
  setTemplateId: (id: string) => void
  setUserId: (userId: string | null) => void
  setDeployUrl: (id: string) => void
  setSub: (sub: string) => void
  setGitRepoUrl: (url: string) => void
  reset: () => void
}

export const useBuilderStore = create<BuilderState>()(
  devtools(
    persist(
      (set) => ({
        step: 0,
        isNotionFetching: false,
        userId: null,
        notionLastProcessedCode: null,
        notionPageId: null,
        siteId: null,
        siteTitle: null,
        siteDescription: null,
        templateId: null,
        deployUrl: null,
        sub: null,
        gitRepoUrl: null,

        setBuilderStep: (step) => {
          logger.log('info', '🚀 Onboarding step changed:', { step })
          set({ step })
        },

        setIsNotionFetching: (status) => set({ isNotionFetching: status }),

        setUserId: (id: string | null) => {
          logger.log('info', '🚀 User ID set:', { id })
          set({ userId: id })
        },

        setNotionLastProcessedCode: (code) => {
          logger.log('info', '🔹 Last processed code:', { code })
          set({ notionLastProcessedCode: code })
        },
        setNotionPageId: (id) => {
          logger.log('info', '🚀 Saved new template copy:', { id })
          set({ notionPageId: id })
        },

        setSiteId: (id) => {
          logger.log('info', '🚀 Saved new site:', { id })
          set({ siteId: id })
        },

        setSiteTitle: (title) => {
          logger.log('info', '🚀 Saved site title:', { title })
          set({ siteTitle: title })
        },

        setSiteDescription: (description) => {
          logger.log('info', '🚀 Saved site description:', { description })
          set({ siteDescription: description })
        },

        setTemplateId: (id) => {
          logger.log('info', '🚀 Saved template ID:', { id })
          set({ templateId: id })
        },

        setDeployUrl: (url) => {
          logger.log('info', '🚀 Saved deployment URL:', { url })
          set({ deployUrl: url })
        },
        setSub: (sub) => {
          logger.log('info', '🚀 Saved subdomain info:', { sub })
          set({ sub })
        },
        setGitRepoUrl: (url) => {
          logger.log('info', '🚀 Saved Git repo URL:', { url })
          set({ gitRepoUrl: url })
        },
        reset: () =>
          set({
            step: 0,
            isNotionFetching: false,
            userId: null,
            notionLastProcessedCode: null,
            notionPageId: null,
            siteId: null,
            templateId: null,
            deployUrl: null,
            sub: null,
            gitRepoUrl: null,
          }),
      }),
      {
        name: 'builder-storage',
        partialize: (state) => ({
          step: state.step,
          isNotionFetching: state.isNotionFetching,
          userId: state.userId,
          notionPageId: state.notionPageId,
          siteId: state.siteId,
          siteTitle: state.siteTitle,
          siteDescription: state.siteDescription,
          templateId: state.templateId,
          deployUrl: state.deployUrl,
          notionLastProcessedCode: state.notionLastProcessedCode,
          sub: state.sub,
          gitRepoUrl: state.gitRepoUrl,
        }),
      }
    ),
    { name: 'builder-storage' }
  )
)
