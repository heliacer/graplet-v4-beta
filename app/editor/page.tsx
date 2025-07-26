'use client'

import { Folder, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import Dockview from "./components/dockview"
import Logo from "../ui/logo"

export default function Editor() {
  return (
    <div className="h-screen flex flex-col">
      <nav className="h-11 flex items-center justify-between px-2">
        <Link href='/' className="flex items-center gap-2">
          <Logo size={20}/>
          <p className="text-lg">Graplet</p>
        </Link>
        <div className="flex gap-4">
          <Link className='flex items-center gap-2' href='/mystuff'>
            <Folder size={16} />
            <p>My stuff</p>
          </Link>
          <button className="cursor-pointer flex items-center gap-2" onClick={() => signOut({ callbackUrl: '/' })}>
            <LogOut size={16} />
            <p>Sign Out</p>
          </button>
        </div>
      </nav>
      <Dockview />
      <footer className="h-6 flex items-center">
        <p>Footer</p>
      </footer>
    </div>
  )
}