import { redirect } from 'next/navigation'
import { getAuthSession } from '@/shared/lib/auth'
import SiteBuilder from '@/modules/logme/components/builder/SiteBuilder'

export default function NewSitePage() {
  const defaultApp = 'logme'

  return (
    <BuilderLayout app={defaultApp}>
      <SiteBuilder />
    </BuilderLayout>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function BuilderLayout({ children, app }: { children: React.ReactNode; app: string }) {
  const session = await getAuthSession()
  if (!session) redirect('/signin')
  return (
    <div className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 max-w-screen-xl mx-auto">
      {children}
    </div>
  )
}
