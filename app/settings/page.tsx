'use client'

import { useSession } from 'next-auth/react'
import { signIn } from 'next-auth/webauthn'
import { SiteNav } from '../lib/components/SiteNav'
import { accountDelete } from '../lib/data/actions'
import { KeyRound, Trash2 } from 'lucide-react'
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
        <div className='flex flex-col h-60 w-60 gap-2 flex-start'>
          <h1 className='text-xl my-2'>Settings</h1>
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
          {status === 'unauthenticated' && (
            <p>
              You are signed out.
              <br /> ( no local settings yet )
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
