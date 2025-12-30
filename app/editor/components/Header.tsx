import Link from 'next/link'
import { Logo } from '@/app/ui/assets/Logo'
import { UserDropdown } from '@/app/ui/components/UserDropdown'
import { NavMenu } from './ui/NavMenu'
import { RunControls } from './ui/controls/runControls'

export function EditorHeader() {
  return (
    <nav className='h-11 flex items-center justify-between px-2'>
      <div className='w-full h-full flex items-center gap-3'>
        <Link href='/'>
          <Logo size={20} />
        </Link>
        <NavMenu />
      </div>
      <RunControls />
      <div className='w-full h-full flex items-center justify-end'>
        <div className='flex gap-4'>
          <UserDropdown />
        </div>
      </div>
    </nav>
  )
}
