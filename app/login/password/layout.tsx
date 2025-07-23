'use client'

import { notFound, useSearchParams } from 'next/navigation'

export default function PasswordLayout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  if (!email) return notFound()

  return <>{children}</>
}