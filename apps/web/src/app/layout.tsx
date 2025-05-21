import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Providers from '@/app/providers'
import { GATracker } from '@/shared/components/tracking/GATracker'
import { generateSeoMetadata } from '@/shared/utils/seo'
import AdSenseScript from '@/shared/components/ads/AdSenseScript'

// Favicon 및 앱 아이콘 설정
export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
}

// 앱 아이콘과 링크 설정
export const icons = {
  icon: [
    { url: '/favicon.ico', sizes: 'any' },
    { url: '/icon.png', type: 'image/png', sizes: '32x32' },
  ],
  apple: [
    { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  ],
  shortcut: '/favicon.ico',
}

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = generateSeoMetadata({
  description: '당신의 Notion 페이지로 멋진 블로그나 포트폴리오, 팀 사이트를 만들어보세요.',
  keywords: ['notion', 'blog', 'website', 'portfolio', 'team site', 'logme', '웹사이트', '블로그', '노션'],
})
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-4973023709665458" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'system';
                  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const shouldUseDark = theme === 'dark' || (theme === 'system' && systemPrefersDark);
                  if (shouldUseDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (_) {}
              })();
            `,
          }}
        />
        {/* AdSense 스크립트는 클라이언트에서만 로드 */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            ></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <GATracker />
          <AdSenseScript />
          {children}
        </Providers>
      </body>
    </html>
  )
}
