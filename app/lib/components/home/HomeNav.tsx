import clsx from 'clsx'
import Link from 'next/link'
import { Logo } from '../Logo'

export function HomeNav() {
  return (
    <nav className='fixed w-full flex justify-between p-4'>
      <Link href='/' className='active:scale-90'>
        <Logo size={30} />
      </Link>
      <div className='flex items-start gap-2'>
        <Link
          draggable='false'
          className={clsx(
            'border border-ui-600',
            'rounded-md py-0.5 px-4',
            'hover:bg-ui-750 select-none'
          )}
          href='/login'
        >
          Sign in
        </Link>
        {/** @todo (#91) sign up with a <Link>, other <a> -> convert to link */}
        <div
          className={clsx(
            'border border-ui-600 bg-ui-800',
            'rounded-md py-0.5 px-4 select-none',
            'hover:bg-ui-750 cursor-not-allowed'
          )}
        >
          Sign up
        </div>
      </div>
    </nav>
  )
}
