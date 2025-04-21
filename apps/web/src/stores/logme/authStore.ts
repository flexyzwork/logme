import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface Notion {
  authState: string | null
}

interface Github {
  authState: string | null
  installationId: number | null
}

interface AuthState {
  notion: Notion
  github: Github
  setNotionAuthState: (authState: string) => void
  setGithubAuthState: (authState: string) => void
  setGithubInstallationId: (installationId: number) => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        notion: {
          authState: null,
        },

        github: {
          authState: null,
          installationId: null,
        },

        setNotionAuthState: (authState) =>
          set((state) => ({
            notion: { ...state.notion, authState },
          })),

        setGithubAuthState: (authState) =>
          set((state) => ({
            github: { ...state.github, authState },
          })),

        setGithubInstallationId: (installationId) =>
          set((state) => ({
            github: { ...state.github, installationId },
          })),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          notion: {
            authState: state.notion.authState,
          },
          github: {
            authState: state.github.authState,
            installationId: state.github.installationId,
          },
        }),
      }
    ),
    { name: 'auth-storage' }
  )
)
