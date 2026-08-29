import Image from 'next/image'
import clsx from 'clsx'
import { useLayoutEffect, useState } from 'react'
import Link from 'next/link'
import { Folder, LogOut, Settings, User2 } from 'lucide-react'
import { useClickOutside } from '../hooks/useClickOutside'
import { signOut, useSession } from 'next-auth/react'

/** @todo (#91) Revamp login: mix NEW user dropdown with login/signup on permanent nav! */
export function UserMenu() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  const refClick = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false)
  })

  useLayoutEffect(() => {
    return () => {
      setIsOpen(false)
    }
  }, [])

  return (
    <div className='relative' ref={refClick}>
      <Image
        height={24}
        width={24}
        onClick={() => setIsOpen(p => !p)}
        className='rounded-full border border-ui-700 cursor-pointer active:scale-95'
        src='https://gravatar.com/avatar/97228600f711ecc42ed47e5af95988462a151ad9b9edf81c0a1f3d1f53b463f5'
        alt='user profile picture'
      />
      <div
        className={clsx(
          'w-52 absolute text-sm z-10 right-0 mt-1 mr-0.5 rounded-lg',
          'border border-ui-700 shadow-xl bg-ui-900 py-2',
          isOpen ? 'block' : 'hidden'
        )}
      >
        <h2 className='text-md font-bold mx-3 mb-1'>{session?.user?.name}</h2>
        <div className='mx-2 border border-transparent rounded hover:bg-ui-750'>
          <Link
            className='py-0.5 w-full px-1 flex gap-2 items-center'
            href='/mystuff'
          >
            <Folder className='text-ui-400' size={16} />
            <p>My Stuff</p>
          </Link>
        </div>
        <div className='mx-2 border border-transparent rounded hover:bg-ui-750'>
          <Link
            className='py-0.5 w-full px-1 flex gap-2 items-center'
            href='/users'
          >
            <User2 className='text-ui-400' size={16} />
            <p>Profile</p>
          </Link>
        </div>
        <div className='mx-2 border border-transparent rounded hover:bg-ui-750'>
          <Link
            className='py-0.5 w-full px-1 flex gap-2 items-center'
            href='/settings'
          >
            <Settings className='text-ui-400' size={16} />
            <p>Settings</p>
          </Link>
        </div>
        <hr className='mx-3 my-1.5 border-ui-700' />
        <div className='mx-2 border border-transparent rounded hover:bg-ui-750'>
          <button
            className='py-0.5 w-full px-1 flex gap-2 items-center cursor-pointer'
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut className='text-ui-400' size={16} />
            <p>Sign out</p>
          </button>
        </div>
      </div>
    </div>
  )
}
