import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Editor'
}

export default function EditorLayout({
  children
}: {
  children: Readonly<React.ReactNode>
}) {
  return <>{children}</>
}
