import { Suspense } from 'react'
import { LogoSolid } from '../ui/assets/LogoSolid'
import { LoginInputSkeleton } from '../ui/components/LoginInputSkeleton'

export default function LoginLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className='flex gap-5 flex-col justify-center items-center min-h-screen'>
      <LogoSolid size={90} />
      <p className='italic'>Early Access.</p>
      <Suspense fallback={<LoginInputSkeleton />}>{children}</Suspense>
    </main>
  )
}
