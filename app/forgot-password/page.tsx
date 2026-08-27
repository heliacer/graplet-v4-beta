import { SquareArrowOutUpRight } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPassword() {
  return (
    <main className='w-full mt-20 flex flex-col gap-4 items-center'>
      <h1 className='text-xl'>Well well well...</h1>

      <div className='flex gap-1'>
        <p>Look who forgot to install a </p>
        <Link
          href='https://bitwarden.com/'
          target='_blank'
          rel='noopener noreferrer'
          className='flex gap-1 items-center text-teal'
        >
          <p>password manager</p>
          <SquareArrowOutUpRight size={14} />
        </Link>
      </div>

      <p className='text-sm text-center text-ui-400'>
        Enter your user account&apos;s verified email address. We&apos;ll send
        you a password reset link,
        <br /> because apparently remembering passwords was too ambitious.
      </p>
    </main>
  )
}
