import BrowserCheckRedirect from '@/components/BrowserCheckRedirect'
import Landing from '@/components/logme/Landing'

export default function LandingPage() {
  return (
    <main className="min-h-screen py-16">
      <BrowserCheckRedirect />
      <Landing />
    </main>
  )
}
