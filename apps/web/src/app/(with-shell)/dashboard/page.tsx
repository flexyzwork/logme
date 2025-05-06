import { redirect } from 'next/navigation'
import { getAuthSession } from '@/shared/lib/auth'
import LogmeDashboard from '@/modules/logme/components/LogmeDashboard'

export default function Dashboard() {
  const defaultApp = 'logme'

  return (
    <DashboardLayout app={defaultApp}>
      <LogmeDashboard />
    </DashboardLayout>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function DashboardLayout({ children, app }: { children: React.ReactNode; app: string }) {
  const session = await getAuthSession()
  if (!session) redirect('/signin')
  return (
    <div className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 max-w-screen-xl mx-auto">
      {children}
    </div>
  )
}
