import Link from 'next/link'
import { Logo } from '@/app/lib/components/Logo'
import { UserMenu } from '@/app/lib/components/UserMenu'
import { NavMenu } from './ui/NavMenu'
import { RunControls } from './ui/controls/RunControls'
import { SaveButton } from './ui/SaveButton'

export function EditorHeader() {
  return (
    <nav className='h-9.5 flex items-center justify-between px-1.5'>
      <div className='w-full h-full flex items-center gap-3'>
        <Link href='/' className='active:scale-90' aria-label='Home'>
          <Logo size={20} />
        </Link>
        <NavMenu />
      </div>
      <RunControls />
      <div className='w-full h-full flex items-center justify-end'>
        <div className='flex gap-4'>
          <SaveButton />
          <UserMenu />
        </div>
      </div>
    </nav>
  )
}
