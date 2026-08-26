import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign up'
}

export default function SignupLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>
}
