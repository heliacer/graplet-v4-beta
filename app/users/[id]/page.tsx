'use client'

import Link from 'next/link'
import { LogoSolid } from '@/app/lib/components/LogoSolid'
import { Folder, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { use, Suspense } from 'react'

function UserProfileContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return (
    <div className='w-xl flex flex-wrap-reverse items-end justify-between gap-6 mx-10'>
      <div className='flex min-h-52 flex-col gap-4'>
        <p className='text-xl'>User Profile</p>
        <p>ID: {id}</p>

        <Link className='flex items-center gap-2' href='/mystuff'>
          <Folder size={18} />
          <p>Go to My Stuff</p>
        </Link>

        <button
          className='cursor-pointer flex items-center gap-2'
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut size={18} />
          <p>Sign Out</p>
        </button>
      </div>

      <LogoSolid size={90} />
    </div>
  )
}

export default function UserProfile({
  params
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <main className='flex justify-center items-center min-h-screen'>
      <Suspense fallback={null}>
        <UserProfileContent params={params} />
      </Suspense>
    </main>
  )
}
