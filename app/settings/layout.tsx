import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Account'
}

export default function AccountLayout({
  children
}: {
  children: Readonly<React.ReactNode>
}) {
  return <>{children}</>
}
