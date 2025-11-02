import type { Metadata } from 'next'
import './ui/globals.css'
import { nunito } from './ui/fonts'
import { SessionProvider } from 'next-auth/react'

export const metadata: Metadata = {
  title: {
    template: '%s | Graplet',
    default: 'Graplet: Create 3D Experiences with Interactive Blocks'
  },
  description:
    'Design interactive 3D scenes using intuitive visual blocks. Graplet combines a block-based editor with real-time rendering to bring your ideas to life — no coding required. Early Access only.'
}

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.className} dark:bg-zinc-900 bg-zinc-100 text-zinc-800 dark:text-zinc-200`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
