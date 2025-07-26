'use client'

import { ChevronDown, Folder, LogOut, User } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import Dockview from "./components/dockview"
import Logo from "../ui/logo"
import { useState } from "react"
import clsx from "clsx"
import { useClickOutside } from "../ui/hooks/useClickOutside"

export default function Editor() {
  const { data: session } = useSession()
  const [isOpened, setIsOpened] = useState<boolean>(false)

   const dropdownRef = useClickOutside<HTMLDivElement>(() => {
    setIsOpened(false)
  })

  return (
    <div className="h-screen flex flex-col">
      <nav className="h-11 flex items-center justify-between px-2">
        <Link href='/' className="flex items-center gap-2">
          <Logo size={20}/>
          <p className="text-lg">Graplet</p>
        </Link>
        <div className="flex gap-4">
          <div ref={dropdownRef} className="relative">
            <button
              className={clsx(
                'flex items-center gap-1 border border-transparent rounded-lg cursor-pointer px-1',
                'hover:bg-zinc-800 hover:border-zinc-700',
                isOpened && 'bg-zinc-800 border-zinc-700'
              )}
              onClick={() => setIsOpened(!isOpened)}
            >
              <User size={16}/>
              <p>{session?.user?.name}</p>
              <ChevronDown size={16}/>
            </button>
            <div className={clsx(
                'absolute right-0 top-full min-w-32 rounded-lg translate-y-0.5 p-1 border border-zinc-700 bg-zinc-800 z-10',
                !isOpened && 'hidden'
              )}>
              <div className="border border-transparent rounded px-1 hover:border-zinc-600 hover:bg-zinc-700">
                <Link className='flex items-center gap-2' href='/mystuff'>
                  <Folder size={16} />
                  <p>My stuff</p>
                </Link>
              </div>
              <div className="border border-transparent rounded px-1 hover:border-zinc-600 hover:bg-zinc-700">
                <button className="cursor-pointer flex items-center gap-2" onClick={() => signOut({ callbackUrl: '/' })}>
                  <LogOut size={16} />
                  <p>Sign Out</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <Dockview />
      <footer className="h-6 flex items-center">
        <p>Footer</p>
      </footer>
    </div>
  )
}