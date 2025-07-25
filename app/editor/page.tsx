'use client'

import { Folder, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import Dockview from "./components/dockview"

export default function Editor() {
  return (
    <div className="h-screen flex flex-col">
      <nav className="h-11 flex gap-4 items-center">
        <p>Nav</p>
        <Link className='flex items-center gap-2' href='/mystuff'>
          <Folder size={18} />
          <p>My stuff</p>
        </Link>
        <button className="cursor-pointer flex items-center gap-2" onClick={() => signOut({ callbackUrl: '/' })}>
          <LogOut size={18} />
          <p>Sign Out</p>
        </button>
      </nav>
      <Dockview />
      <footer className="h-6 flex items-center">
        <p>Footer</p>
      </footer>
    </div>
  )
}