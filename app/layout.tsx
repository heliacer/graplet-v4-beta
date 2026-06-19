import type { Metadata } from 'next'
import { nunito } from './ui/fonts'
import { SessionProvider } from 'next-auth/react'
import { cookies } from 'next/headers'
import { Suspense } from 'react'
import './ui/globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s @ Graplet',
    default: 'Graplet'
  },
  description:
    'Design interactive 3D scenes using intuitive visual blocks. Graplet combines a block-based editor with real-time rendering to bring your ideas to life — no coding required. Early Access only.'
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
