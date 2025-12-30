'use client'

import Link from 'next/link'
import { Cuboid, LogOut, ToolCase } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { LogoSolid } from '../ui/assets/LogoSolid'

export default function MyStuff() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.name === 'heliacer'

  return (
    <main className='flex justify-center items-center min-h-screen'>
      <div className='w-xl flex flex-wrap-reverse items-end justify-between gap-6 mx-10'>
        <div className='flex min-h-52 flex-col gap-4'>
          <p className='text-xl'>My Stuff</p>
          <p>Welcome, {session?.user?.name}</p>
          <Link className='flex items-center gap-2' href='/editor'>
            <Cuboid size={18} />
            <p>Go to Editor</p>
          </Link>
          <button
            className='cursor-pointer flex items-center gap-2'
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut size={18} />
            <p>Sign Out</p>
          </button>
          {isAdmin && (
            <Link className='flex items-center gap-2' href='/admin'>
              <ToolCase size={18} />
              Go to Admin
            </Link>
          )}
        </div>
        <LogoSolid size={90} />
      </div>
    </main>
  )
}
