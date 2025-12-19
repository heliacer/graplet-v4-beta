'use client'

import LogoSolid from '@/app/ui/assets/LogoSolid'
import { Folder, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { use } from 'react'

export default function BlogPostPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  return (
    <main className='flex justify-center items-center min-h-screen'>
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
    </main>
  )
}
