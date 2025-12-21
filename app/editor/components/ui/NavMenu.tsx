import Link from 'next/link'
import Logo from '@/app/ui/logo'
import { FileMenu } from './menus/FileMenu'

export default function NavMenu() {
  return (
    <nav className='w-full h-full flex items-center gap-4'>
      <Link href='/' className='flex items-center gap-2'>
        <Logo size={20} />
        <p className='text-lg'>Graplet</p>
      </Link>
      <FileMenu />
    </nav>
  )
}
