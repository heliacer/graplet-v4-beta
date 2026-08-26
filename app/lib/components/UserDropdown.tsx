import { Folder, LogOut, Settings2, User } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { Dropdown, DropdownItemProps } from './Dropdown'
import { useRouter } from 'next/navigation'

export function UserDropdown() {
  const { data: session } = useSession()
  const router = useRouter()

  const user = session?.user
  if (user === undefined) return <>Not logged in</>

  const items: DropdownItemProps[] = [
    {
      label: 'My Stuff',
      Icon: Folder,
      onClick: () => router.push('/mystuff')
    },
    {
      label: 'Profile',
      Icon: User,
      onClick: () => router.push(`/users/${user.id}`)
    },
    {
      label: 'Account',
      Icon: Settings2,
      onClick: () => router.push('/account')
    },
    {
      label: 'Sign out',
      Icon: LogOut,
      onClick: () => signOut({ callbackUrl: '/' })
    }
  ]

  return (
    <Dropdown
      label={user.name || 'Guest'}
      Icon={User}
      items={items}
    />
  )
}
