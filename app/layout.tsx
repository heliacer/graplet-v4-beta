import type { Metadata } from 'next'
import './ui/globals.css'
import { nunito } from './ui/fonts'
import { SessionProvider } from 'next-auth/react'
import { cookies } from 'next/headers'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: {
    template: '%s | Graplet',
    default: 'Graplet: Create 3D Experiences with Interactive Blocks'
  },
  description:
    'Design interactive 3D scenes using intuitive visual blocks. Graplet combines a block-based editor with real-time rendering to bring your ideas to life — no coding required. Early Access only.'
}

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const store = await cookies()
  return (
    <html lang='en' className={store.get('theme')?.value}>
      <body className={`${nunito.className} bg-ui-900 text-ui-200`}>
        <SessionProvider>{children}</SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
