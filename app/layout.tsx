import type { Metadata } from 'next'
import { nunito } from './lib/fonts'
import { SessionProvider } from 'next-auth/react'
import { cookies } from 'next/headers'
import { Suspense } from 'react'
import './lib/globals.css'

const description = `An Interactive 3D Editor and collaborative platform for creative Arts, Digital Assets and Game Design.`

export const metadata: Metadata = {
  title: {
    template: '%s @ Graplet',
    default: 'Graplet'
  },
  metadataBase: new URL('https://graplet.vercel.app'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    url: 'https://graplet.vercel.app',
    title: 'Graplet',
    siteName: 'Graplet',
    images: [{ url: '/og-image.png' }],
    description
  },
  description
}

async function Layout({ children }: { children: Readonly<React.ReactNode> }) {
  const theme = (await cookies()).get('theme')?.value

  return (
    <body className={`${theme} ${nunito.className} bg-ui-900 text-ui-200`}>
      <SessionProvider>{children}</SessionProvider>
    </body>
  )
}

export default function RootLayout({
  children
}: {
  children: Readonly<React.ReactNode>
}) {
  return (
    <html lang='en'>
      <Suspense fallback={<body />}>
        <Layout>{children}</Layout>
      </Suspense>
    </html>
  )
}
