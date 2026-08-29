import type { Metadata } from 'next'
import { nunito } from './lib/fonts'
import { SessionProvider } from 'next-auth/react'
import './lib/globals.css'

const description = `An Interactive 3D Editor and collaborative platform for creative Arts, Digital Assets and Game Design.`

export const metadata: Metadata = {
  title: { template: '%s @ Graplet', default: 'Graplet' },
  metadataBase: new URL('https://vercel.app'),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: 'https://vercel.app',
    title: 'Graplet',
    siteName: 'Graplet',
    images: [{ url: '/og-image.png' }],
    description
  },
  description
}

const themeScript = `const match = document.cookie.split('; ').find(row => row.startsWith('theme='));const theme = match ? match.split('=')[1] : 'dark';document.documentElement.classList.add(theme);document.documentElement.style.colorScheme = theme;`
export default function RootLayout({
  children
}: {
  children: Readonly<React.ReactNode>
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <SessionProvider>
        <body className={`${nunito.className} bg-ui-900 text-ui-200`}>
          {children}
        </body>
      </SessionProvider>
    </html>
  )
}
