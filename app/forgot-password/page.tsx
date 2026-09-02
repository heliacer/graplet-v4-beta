import { SquareArrowOutUpRight } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPassword() {
  return (
    <main className='w-full mt-20 flex flex-col gap-4 items-center'>
      <h1 className='text-xl'>Reset your password</h1>
      <div className='text-sm text-center'>
        <p>
          Enter your verified email address and we&apos;ll send you a password
          reset link.
        </p>
        <div className='flex gap-1 justify-center '>
          <p>Consider using a</p>
          <Link
            href='https://bitwarden.com/'
            target='_blank'
            rel='noopener noreferrer'
            className='flex gap-1 items-center text-blue hover:underline'
          >
            <p>password manager</p>
            <SquareArrowOutUpRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  )
}
