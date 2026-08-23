import Link from 'next/link'
import { LogoSolid } from './ui/assets/LogoSolid'
import clsx from 'clsx'
import { Blocks } from 'lucide-react'

export default function Home() {
  return (
    <div className='relative h-screen overflow-x-hidden'>
      <nav className='flex justify-end gap-2 p-4'>
        <Link
          className={clsx(
            'border border-ui-600',
            'rounded-md py-0.5 px-4',
            'hover:bg-ui-750'
          )}
          href='/login'
        >
          Sign in
        </Link>
        {/** @todo (#91) sign up with a <Link>, other <a> -> convert to link */}
        <div
          className={clsx(
            'border border-ui-600 bg-ui-800',
            'rounded-md py-0.5 px-4',
            'hover:bg-ui-750 cursor-not-allowed'
          )}
        >
          Sign up
        </div>
      </nav>
      <div className='absolute text-ui-650 left-30'>
        <LogoSolid size={700} />
      </div>
      <div className='w-full flex flex-col gap-4 justify-center items-center h-[calc(100%-100px)]'>
        <p className='text-xl'>Graplet v4 prototype 1 </p>
        <Link
          className={clsx(
            'border border-teal bg-ui-800',
            'rounded-md py-0.5 px-3',
            'hover:bg-ui-750',
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
