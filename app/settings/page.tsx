'use client'

import { useSession } from 'next-auth/react'
import { SiteNav } from '../lib/components/SiteNav'
import { accountDelete } from '../lib/data/actions'

export default function Settings() {
  const { data: session } = useSession()

  /**
   * @todo (#91) Revamp Login - figure out what to do precisely on signout on other page
   * -> info beacon? redirect to home?
   */
  function handleDelete() {
    if (!session?.user.id) {
      alert('You are signed out')
      return
    }

    const isSure = confirm('Are you sure?')
    if (isSure) {
      accountDelete(session.user.id)
    }
  }

  return (
    <main className='h-screen'>
      <SiteNav />
      <div className='flex w-full h-full justify-center items-center'>
        <div className='flex items-center gap-2'>
          <h1 className='text-xl m-2'>Settings</h1>
          <button
            onClick={handleDelete}
            className='cursor-pointer hover:bg-ui-800 rounded px-1 self-center'
          >
            Delete account
          </button>
        </div>
      </div>
    </main>
  )
}
