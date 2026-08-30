'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { Logo } from '../Logo'
import { useSession } from 'next-auth/react'
import { UserMenu } from '../UserMenu'

export function HomeNav() {
  const { status } = useSession()

  return (
    <nav className='fixed w-full flex justify-between p-4'>
      <Link href='/' className='active:scale-90' aria-label='Home'>
        <Logo size={30} />
      </Link>
      {status === 'authenticated' && <UserMenu userIconSize={32} />}
      {status === 'unauthenticated' && (
        <div className='flex items-start gap-2'>
          <Link
            href='/login'
            draggable='false'
            className={clsx(
              'border border-ui-600',
              'rounded-md py-0.5 px-4',
              'hover:bg-ui-750 select-none'
            )}
          >
            Sign in
          </Link>
          <Link
            href='/signup'
            draggable='false'
            className={clsx(
              'border border-ui-600 bg-ui-800',
              'rounded-md py-0.5 px-4 select-none',
              'hover:bg-ui-750'
            )}
          >
            Sign up
          </Link>
        </div>
      )}
    </nav>
  )
}
