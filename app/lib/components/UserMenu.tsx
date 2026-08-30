import Image from 'next/image'
import clsx from 'clsx'
import { useLayoutEffect, useState } from 'react'
import Link from 'next/link'
import { Folder, LogOut, Settings, User2, UserRound } from 'lucide-react'
import { useClickOutside } from '../hooks/useClickOutside'
import { signOut, useSession } from 'next-auth/react'

export function UserMenu({ userIconSize = 24 }: { userIconSize?: number }) {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  const refClick = useClickOutside<HTMLDivElement>(() => setIsOpen(false))

  const items = [
    { href: '/mystuff', label: 'My Stuff', icon: Folder },
    { href: '/settings', label: 'Settings', icon: Settings }
  ]
  
  if (session?.user) {
    items.push({
      href: `/users/${session.user.id}`,
      label: 'Profile',
      icon: User2
    })
  }

  useLayoutEffect(() => () => setIsOpen(false), [])

  return (
    <div className='relative' ref={refClick}>
      {status === 'authenticated' ? (
        <Image
          height={userIconSize}
          width={userIconSize}
          onClick={() => setIsOpen(p => !p)}
          className='rounded-full border border-ui-700 cursor-pointer active:scale-95'
          src={`https://gravatar.com/avatar/${session.user.emailHash}`}
          alt='user profile picture'
        />
      ) : (
        <div
          onClick={() => setIsOpen(p => !p)}
          style={{ width: userIconSize, height: userIconSize }}
          className={clsx(
            'rounded-full border border-ui-700 cursor-pointer',
            'active:scale-95 flex items-center justify-center'
          )}
        >
          <UserRound size={14} />
        </div>
      )}

      <div
        className={clsx(
          'w-52 absolute z-10 right-0 mt-1.5 rounded-lg',
          'border border-ui-700 shadow-xl bg-ui-900 py-2 text-sm',
          isOpen ? 'block' : 'hidden'
        )}
      >
        {status === 'authenticated' ? (
          <div className='flex gap-2 items-center mx-2 mb-2'>
            <Image
              height={24}
              width={24}
              className='rounded-full'
              src={`https://gravatar.com/avatar/${session.user.emailHash}`}
              alt='user profile picture'
            />
            <h2 className='font-bold'>{session.user.name}</h2>
          </div>
        ) : (
          <div className='mx-2 ml-3 flex justify-between items-center'>
            <p className='font-bold'>Guest</p>
            <Link
              href='/login'
              draggable='false'
              className={clsx(
                'border border-ui-600',
                'rounded-md py-0.5 px-4',
                'hover:bg-ui-800 select-none'
              )}
            >
              Sign in
            </Link>
          </div>
        )}

        <hr className='my-1.5 border-ui-750' />

        {items.map(({ href, label, icon: Icon }) => (
          <div
            key={href}
            className='mx-2 border border-transparent rounded-md hover:bg-ui-800'
          >
            <Link
              href={href}
              className='py-0.5 w-full px-1 flex gap-2 items-center'
            >
              <Icon className='text-ui-400' size={16} />
              <p>{label}</p>
            </Link>
          </div>
        ))}

        {status === 'authenticated' && (
          <>
            <hr className='my-1.5 border-ui-750' />

            <div className='mx-2 border border-transparent rounded-md hover:bg-ui-800'>
              <button
                className='py-0.5 w-full px-1 flex gap-2 items-center cursor-pointer'
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className='text-ui-400' size={16} />
                <p>Sign out</p>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
