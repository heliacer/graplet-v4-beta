import { ChevronDown, Folder, LogOut, Settings2, User } from 'lucide-react'
import {
  DropdownButton,
  DropdownContent,
  DropdownMenu,
  DropdownOption,
  DropdownSeparator
} from './Dropdown'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

export default function UserDropdown() {
  const { data: session } = useSession()

  return (
    <DropdownMenu>
      <DropdownButton>
        <User size={16} />
        <p>{session?.user?.name}</p>
        <ChevronDown size={16} />
      </DropdownButton>
      <DropdownContent className="min-w-38">
        <DropdownOption asChild>
          <Link className="flex items-center gap-2" href="/mystuff">
            <Folder size={14} />
            <p>My Stuff</p>
          </Link>
        </DropdownOption>
        <DropdownSeparator />
        <DropdownOption asChild>
          <Link
            className="flex items-center gap-2"
            href={`/users/${session?.user?.id}`}
          >
            <User size={14} />
            <p>Profile</p>
          </Link>
        </DropdownOption>
        <DropdownOption asChild>
          <Link className="flex items-center gap-2" href="/account">
            <Settings2 size={14} />
            <p>Account</p>
          </Link>
        </DropdownOption>
        <DropdownSeparator />
        <DropdownOption onClick={() => signOut({ callbackUrl: '/' })}>
          <LogOut size={14} />
          <p>Sign Out</p>
        </DropdownOption>
      </DropdownContent>
    </DropdownMenu>
  )
}
