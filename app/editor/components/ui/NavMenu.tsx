import Link from 'next/link'
import Logo from '@/app/ui/logo'
import { FileMenu } from './menus/FileMenu'
import { Settings2 } from 'lucide-react'
import clsx from 'clsx'

export default function NavMenu() {
  return (
    <nav className='w-full h-full flex items-center gap-4'>
      <Link href='/' className='flex items-center gap-2'>
        <Logo size={20} />
        <p className='text-lg'>Graplet</p>
      </Link>
      <div className='flex gap-2'>
        <FileMenu />
        <button
          className={clsx(
            'text-sm flex gap-1 px-1 items-center',
            'border rounded-md',
            'border-ui-700',
            'hover:bg-ui-750 bg-ui-800'
          )}
        >
          <Settings2 size={14} />
          <p>Settings</p>
        </button>
      </div>
    </nav>
  )
}
