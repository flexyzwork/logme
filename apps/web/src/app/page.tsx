import Landing from "@/modules/logme/components/Landing";
import BrowserCheckRedirect from "@/shared/components/BrowserCheckRedirect";


export default function LandingPage() {
  return (
    <main className="min-h-screen py-16">
      <BrowserCheckRedirect />
      <Landing />
    </main>
  )
}
