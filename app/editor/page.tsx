'use client'

import { DropdownMenu, DropdownButton, DropdownContent, DropdownOption, DropdownSeparator } from "../ui/components/Dropdown"
import { ChevronDown, Folder, LogOut, Settings2, User } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import Dockview from "./components/dockview"
import Logo from "../ui/logo"

export default function Editor() {
  const { data: session } = useSession()

  return (
    <div className="h-screen flex flex-col">
      <nav className="h-11 flex items-center justify-between px-2">
        <Link href='/' className="flex items-center gap-2">
          <Logo size={20} />
          <p className="text-lg">Graplet</p>
        </Link>
        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownButton>
              <User size={16} />
              <p>{session?.user?.name}</p>
              <ChevronDown size={16} />
            </DropdownButton>
            <DropdownContent className='min-w-44'>
              <DropdownOption asChild>
                <Link className='flex items-center gap-2' href={`/users/${session?.user?.id}`}>
                  <User size={14} />
                  <p>Profile</p>
                </Link>
              </DropdownOption>
              <DropdownOption asChild>
                <Link className='flex items-center gap-2' href='/mystuff'>
                  <Folder size={14} />
                  <p>My Stuff</p>
                </Link>
              </DropdownOption>
              <DropdownOption asChild>
                <Link className='flex items-center gap-2' href='/account'>
                  <Settings2 size={14} />
                  <p>Account Settings</p>
                </Link>
              </DropdownOption>
              <DropdownSeparator />
              <DropdownOption onClick={() => signOut({ callbackUrl: '/' })}>
                <LogOut size={14} />
                <p>Sign Out</p>
              </DropdownOption>
            </DropdownContent>
          </DropdownMenu>
        </div>
      </nav>
      <Dockview />
      <footer className="h-6 flex items-center">
        <p>Footer</p>
      </footer>
    </div>
  )
}