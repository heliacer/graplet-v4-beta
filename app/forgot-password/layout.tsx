import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forgot your password?'
}

export default function LoginLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>
}
