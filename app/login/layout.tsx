import { Suspense } from 'react'
import InputSkeleton from '../ui/components/InputSkeleton'
import LogoSolid from '../ui/logo-solid'

export default function LoginLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex gap-5 flex-col justify-center items-center min-h-screen">
      <LogoSolid size={90} />
      <p className="italic">Early Access.</p>
      <Suspense fallback={<InputSkeleton />}>{children}</Suspense>
    </main>
  )
}
