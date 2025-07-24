'use client'

import { Folder, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import EarlyAccessLogo from "../ui/ea-logo"

export default function Editor() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen">
      <div className="min-w-xl min-h-52 flex justify-between">
        <div className="flex flex-col gap-4">
          <p className="text-xl">Editor</p>
          <p>Psst!</p>
          <Link className='flex items-center gap-2' href='/mystuff'>
            <Folder size={18} />
            <p>Go to my stuff</p>
          </Link>
          <button className="cursor-pointer flex items-center gap-2" onClick={() => signOut({ callbackUrl: '/' })}>
            <LogOut size={18} />
            <p>Sign Out</p>
          </button>
        </div>
        <EarlyAccessLogo size={90} />
      </div>
    </main>
  )
}