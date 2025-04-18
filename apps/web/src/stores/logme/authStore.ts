import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// interface OAuthUser {
//   id: string
//   name: string
//   email: string
//   avatar_url: string
//   login?: string
// }

interface Notion {
  // user: OAuthUser | null
  // accessToken: string | null
  authState: string | null
}

interface Github {
  // user: OAuthUser | null
  // accessToken: string | null
  authState: string | null
  installationId: number | null
  // installationToken: string | null
}

// interface Vercel {
//   // user: OAuthUser | null
//   accessToken: string | null
// }

interface AuthState {
  // user: User | null
  notion: Notion
  github: Github
  // vercel: Vercel

  // setUser: (user: User) => void
  // loginNotion: (user: OAuthUser, accessToken: string) => void
  // logoutNotion: () => void
  // loginGithub: (user: OAuthUser) => void
  // logoutGithub: () => void
  setNotionAuthState: (authState: string) => void
  setGithubAuthState: (authState: string) => void
  setGithubInstallationId: (installationId: number) => void
  // setGithubInstallationToken: (token: string) => void
  // setVercelToken: (accessToken: string) => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        // user: null,
        notion: {
          // user: null,
          // accessToken: null,
          authState: null,

        },
        github: {
          // user: null,
          // accessToken: null,
          authState: null,
          installationId: null,
          // installationToken: null,
        },
        // vercel: { accessToken: null },

        // setUser: (user) => {
        //   console.log('✅ 사용자 정보 저장:', user)
        //   set({ user })
        // },

        // loginNotion: (user, accessToken) => {
        //   console.log('✅ Notion 로그인:', user)
        //   set((state) => ({
        //     ...state,
        //     notion: { ...state.notion, user, accessToken },
        //   }))
        // },

        // logoutNotion: () => {
        //   console.log('🔴 Notion 로그아웃')
        //   set((state) => ({
        //     ...state,
        //     notion: { user: null, accessToken: null },
        //   }))
        // },

        // loginGithub: (user: OAuthUser) => {
        //   console.log('✅ Github 로그인:', user)
        //   set((state) => ({
        //     ...state,
        //     github: {
        //       ...state.github,
        //       user,
        //       // accessToken,
        //       authState: null,
        //     },
        //   }))
        // },

        // logoutGithub: () => {
        //   console.log('🔴 Github 로그아웃')
        //   set((state) => ({
        //     ...state,
        //     github: {
        //       user: null,
        //       accessToken: null,
        //       authState: null,
        //       installationId: null,
        //       installationToken: null,
        //     },
        //   }))
        // },


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

        // setGithubInstallationToken: (token) =>
        //   set((state) => ({
        //     github: { ...state.github, installationToken: token },
        //   })),

        // setVercelToken: (accessToken) =>
        //   set((state) => ({
        //     vercel: { ...state.vercel, accessToken },
        //   })),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          // user: state.user,
          notion: {
            authState: state.notion.authState,
          },
          github: {
            // user: state.github.user,
            // accessToken: state.github.accessToken,
            authState: state.github.authState,
            installationId: state.github.installationId,
            // installationToken: state.github.installationToken,
          },
          // vercel: state.vercel,
        }),
      },
    ),
    { name: 'auth-storage' },
  ),
)
