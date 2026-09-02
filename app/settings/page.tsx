'use client'

import { useSession } from 'next-auth/react'
import { signIn } from 'next-auth/webauthn'
import { SiteNav } from '../lib/components/SiteNav'
import { accountDelete } from '../lib/data/actions'
import { KeyRound, Trash2 } from 'lucide-react'
import Image from 'next/image'
import clsx from 'clsx'

export default function Settings() {
  const { data: session, status } = useSession()

  /**
   * @todo (#91) Revamp Login - figure out what to do precisely on signout on other page
   * -> info beacon? redirect to home?
   */
  function handleDelete() {
    if (!session?.user.id) return

    if (confirm('Are you sure?')) {
      accountDelete(session.user.id)
    }
  }

  return (
    <main className='h-screen'>
      <SiteNav />
      <div className='flex w-full h-full justify-center items-center'>
        <div className='flex flex-col h-60 w-100 gap-2 flex-start'>
          <h1 className='text-xl my-2'>Settings</h1>
          <h2 className='font-bold'>Profile</h2>
          {status === 'authenticated' ? (
            <div className='flex gap-2'>
              <Image
                height={80}
                width={80}
                className='border border-ui-700 rounded'
                src={`https://gravatar.com/avatar/${session.user.emailHash}`}
                alt='user profile picture'
              />
              <div>
                <p>{session.user.name}</p>
                <p className='text-ui-400'>{session.user.email}</p>
                <p className='text-ui-400 text-xs'>{session.user.id}</p>
              </div>
            </div>
          ) : (
            <div className='h-20'>
              {status === 'unauthenticated' && <p>Guest</p>}
            </div>
          )}
          <h2 className='font-bold'>Account</h2>
          {status === 'authenticated' && (
            <>
              <button
                onClick={() => signIn('passkey', { action: 'register' })}
                className={clsx(
                  'flex gap-1 cursor-pointer items-center',
                  ' hover:bg-ui-800 rounded px-1 self-start'
                )}
              >
                <KeyRound size={16} className='text-ui-400' />
                <p>Register new Passkey</p>
              </button>
              <button
                onClick={handleDelete}
                className={clsx(
                  'flex gap-1 cursor-pointer items-center',
                  ' hover:bg-ui-800 rounded px-1 self-start'
                )}
              >
                <Trash2 size={16} className='text-red' />
                <p>Delete account</p>
              </button>
            </>
          )}
          {status === 'unauthenticated' && <p>You are signed out.</p>}
        </div>
      </div>
    </main>
  )
}
