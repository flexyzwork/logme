'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export default function Landing() {
  const getCurrentYear = () => {
    return new Date().getFullYear()
  }
  return (
    <main className="flex flex-col px-4 py-20 max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="text-center mb-32">
        <h1 className="text-4xl font-bold mb-6">
          A blog anyone can create <br />
          <br />
          Logme
        </h1>
        <p className="text-muted-foreground text-base mb-10">
          Connect your Notion, GitHub, and Vercel accounts,
          <br />
          and your blog is generated automatically.
        </p>
        <Button asChild>
          <Link href="/logme">Create your blog now</Link>
        </Button>
      </section>

      {/* Process Section */}
      <section className="mb-32 text-center">
        <h2 className="text-xl font-semibold mb-6">How does it work?</h2>
        <div className="grid sm:grid-cols-3 gap-6 text-center text-sm text-muted-foreground ">
          <div>
            <p className="text-base font-bold mb-1 ㅅㄷ">Step 1</p>
            <p>Connect your Notion / GitHub / Vercel accounts.</p>
          </div>
          <div>
            <p className="text-base font-bold mb-1">Step 2</p>
            <p>Select a template and configure your blog.</p>
            (More templates coming soon!)
          </div>
          <div>
            <p className="text-base font-bold mb-1">Step 3</p>
            <p>Your blog will be auto-deployed.</p>
            Prepare to be amazed 😎
          </div>
        </div>
      </section>

      {/* Template Preview Section */}
      <section className="mb-32 text-center">
        <h2 className="text-xl font-semibold mb-6">💻 See the transformation</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Your Notion document becomes a fully-featured blog—automatically.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-muted rounded-md p-4 flex flex-col items-center">
            <p className="text-sm font-medium mb-2">Original Notion</p>
            <Image
              src="/examples/notion-preview-1.png"
              alt="Notion page"
              width={400}
              height={250}
              className="rounded-md border"
            />
          </div>
          <div className="bg-muted rounded-md p-4 flex flex-col items-center">
            <p className="text-sm font-medium mb-2">Converted Blog</p>
            <Image
              src="/examples/blog-preview.png"
              alt="Converted blog"
              width={400}
              height={250}
              className="rounded-md border"
            />
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="mb-32 text-center">
        <h2 className="text-xl font-semibold mb-6">🚀 Key Features</h2>
        <TooltipProvider>
          <div className="grid sm:grid-cols-3 gap-6 text-left text-sm text-muted-foreground">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <p className="text-base font-bold mb-1">📱 Fully responsive on mobile</p>
                  <p>All templates look clean and beautiful on mobile devices.</p>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <Image
                  src="/examples/blog-mobile.png"
                  alt="Fully responsive on mobile"
                  width={300}
                  height={200}
                  className="rounded border"
                />
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <p className="text-base font-bold mb-1">🔍 Auto-generated preview thumbnails</p>
                  <p>
                    Preview thumbnails (OG images) are auto-generated, making your shared links look attractive effortlessly.
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <Image
                  src="/examples/blog-og.png"
                  alt="Auto-generated preview thumbnails"
                  width={300}
                  height={200}
                  className="rounded border"
                />
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <p className="text-base font-bold mb-1">🖼️ Full image support</p>
                  <p>
                    Images attached in Notion are seamlessly reflected in your blog, automatically optimized in resolution and aspect ratio.
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <Image
                  src="/examples/blog-preview.png"
                  alt="Full image support"
                  width={300}
                  height={200}
                  className="rounded border"
                />
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </section>
      {/* Pricing Section */}
      <section className="mb-32 text-center">
        <h2 className="text-xl font-semibold mb-4">📦 Pricing</h2>
        <p className="text-base text-muted-foreground">
          We're currently in beta—enjoy it for free!
        </p>
      </section>

      {/* Coffee Support Section */}
      <section className="mb-32 text-center">
        <h2 className="text-lg font-semibold mb-4">☕ Buy us a coffee</h2>
        <p className="text-base text-muted-foreground">
          If you like this service, consider supporting us with a coffee!
          {' '}
          <a
            href="https://buymeacoffee.com/flexyzwork"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-base text-muted-foreground hover:underline"
          >
            {' '}
            <strong className="text-black dark:text-white"> Buy us a coffee</strong>
          </a>
        </p>
      </section>

      {/* Branding Section */}
      <section className="text-center">
        <p className="mt-12 text-xs text-muted-foreground">
          Logme is a blog automation tool built by Flexyz.
        </p>
        <p className="text-xs text-muted-foreground">
          © {getCurrentYear()} Flexyz. All rights reserved.
        </p>
      </section>
    </main>
  )
}
