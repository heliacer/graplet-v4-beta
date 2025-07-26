import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'
import LogoSolid from './ui/logo-solid'

export const metadata: Metadata = {
  title: {
    absolute: 'How did we get there?',
  },
}

export default function NotFound() {
  return (
    <main className='font-light flex gap-5 flex-col justify-center items-center min-h-screen'>
      <LogoSolid size={90} />
      <p className='italic'>Early Access.</p>
      <p>Think you&apos;re lost?</p>

      <Link className='flex items-center gap-1' href='/login'>
        <ArrowRight size={18} />
        <p>Go back</p>
      </Link>
    </main>
  )
}