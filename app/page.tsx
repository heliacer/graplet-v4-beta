import Link from 'next/link'
import { LogoSolid } from './ui/assets/LogoSolid'
import clsx from 'clsx'
import { Blocks } from 'lucide-react'
import { Logo } from './ui/assets/Logo'

export default function Home() {
  return (
    <div className='relative h-screen overflow-x-hidden'>
      <nav className='flex justify-between p-4'>
        <Link href='/' className='active:scale-90'>
          <Logo size={30} />
        </Link>
        <div className='flex items-start gap-2'>
          <Link
            className={clsx(
              'border border-ui-600',
              'rounded-md py-0.5 px-4',
              'hover:bg-ui-750 select-none'
            )}
            href='/login'
          >
            Sign in
          </Link>
          {/** @todo (#91) sign up with a <Link>, other <a> -> convert to link */}
          <div
            className={clsx(
              'border border-ui-600 bg-ui-800',
              'rounded-md py-0.5 px-4 select-none',
              'hover:bg-ui-750 cursor-not-allowed'
            )}
          >
            Sign up
          </div>
        </div>
      </nav>
      <div className='absolute text-ui-650 left-30 -z-10 hover:animate-spin'>
        <LogoSolid size={700} />
      </div>
      <div
        className={clsx(
          'w-full flex flex-col gap-4 ',
          'justify-center items-center',
          'h-[calc(100%-100px)] select-none'
        )}
      >
        <p className='text-xl'>Graplet v4 prototype 1 </p>
        <Link
          draggable='false'
          className={clsx(
            'border border-teal bg-teal/60',
            'rounded-md py-1 px-4',
            'hover:bg-teal/50 active:scale-95',
            'flex gap-2 items-center'
          )}
          href='/editor'
        >
          <Blocks size={16} />
          <p>Open the Editor</p>
        </Link>
      </div>
    </div>
  )
}
