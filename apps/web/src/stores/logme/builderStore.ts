import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface BuilderState {
  step: number
  isNotionFetching: boolean
  userId: string | null
  notionLastProcessedCode: string | null
  notionPageId: string | null
  siteId: string | null
  deploymentUrl: string | null
  isModalOpen: boolean
  showToken: boolean
  setBuilderStep: (step: number) => void
  setIsNotionFetching: (status: boolean) => void
  setNotionLastProcessedCode: (code: string) => void
  setNotionPageId: (id: string) => void
  setSiteId: (id: string) => void
  setUserId: (userId: string | null) => void
  setDeploymentUrl: (id: string) => void
  setIsModalOpen: (isOpen: boolean) => void
  setShowToken: (show: boolean) => void
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
        deploymentUrl: null,
        isModalOpen: true,
        showToken: false,

        setBuilderStep: (step) => {
          console.log(`🚀 온보딩 스텝 변경:`, step)
          set({ step })
        },

        setIsNotionFetching: (status) => set({ isNotionFetching: status }),

        setUserId: (id: string | null) => {
          console.log(`🚀 userId:`, id)
          set({ userId: id })
        },

        setNotionLastProcessedCode: (code) => {
          console.log('🔹 마지막 처리된 코드:', code)
          set({ notionLastProcessedCode: code })
        },
        setNotionPageId: (id) => {
          console.log(`🚀 새 템플릿 복사본 저장:`, id)
          set({ notionPageId: id })
        },

        setSiteId: (id) => {
          console.log(`🚀 새 블로그 저장:`, id)
          set({ siteId: id })
        },

        setDeploymentUrl: (url) => {
          console.log(`🚀 배포 URL 저장:`, url)
          set({ deploymentUrl: url })
        },

        // updateBuilder: (data) => set((state) => ({ ...state, ...data })),
        setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
        setShowToken: (show) => set({ showToken: show }),
      }),
      {
        name: 'builder-storage',
        partialize: (state) => ({
          step: state.step,
          isNotionFetching: state.isNotionFetching,
          userId: state.userId,
          notionPageId: state.notionPageId,
          siteId: state.siteId,
          deploymentUrl: state.deploymentUrl,
          notionLastProcessedCode: state.notionLastProcessedCode,
          isModalOpen: state.isModalOpen,
          showToken: state.showToken,
        }),
      },
    ),
    { name: 'builder-storage' },
  ),
)
