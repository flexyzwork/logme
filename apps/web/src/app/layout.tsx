import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Providers from '@/app/providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Flexyz',
    template: '%s | Flexyz',
  },
  description: '노션으로 만드는 멋진 블로그, 포트폴리오, 팀 사이트',
  metadataBase: new URL('https://flexyz.work'),
  openGraph: {
    title: 'Flexyz',
    description: '노션으로 만드는 멋진 블로그, 포트폴리오, 팀 사이트',
    url: 'https://flexyz.work',
    siteName: 'Flexyz',
    type: 'website',
  },
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Providers>{children}</Providers>
      </body>
    </html>
  )
}
