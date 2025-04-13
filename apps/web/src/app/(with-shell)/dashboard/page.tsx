import LogmeDashboard from '@/components/logme/LogmeDashboard'

export default function Dashboard() {
  const defaultApp = 'logme' // 나중에 dynamic 가능

  return (
    <DashboardLayout app={defaultApp}>
      <LogmeDashboard />
    </DashboardLayout>
  )
}

function DashboardLayout({ app, children }: { app: string; children: React.ReactNode }) {
  return (
    <div className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 max-w-screen-xl mx-auto">
      {children}
    </div>
  )
}
