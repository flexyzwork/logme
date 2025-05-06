import Landing from '@/modules/logme/components/landing/Landing'
import BrowserCheckRedirect from '@/shared/components/system/BrowserCheckRedirect'

export default function LandingPage() {
  return (
    <main className="min-h-screen py-16">
      <BrowserCheckRedirect />
      <Landing />
    </main>
  )
}
