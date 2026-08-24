import Link from 'next/link'
import clsx from 'clsx'
import { Blocks } from 'lucide-react'
import { HomeNav } from './lib/components/home/HomeNav'
import { Github } from './lib/components/icons/Github'

export default function Home() {
  return (
    <div className='h-screen overflow-x-hidden'>
      <HomeNav />
      <div
        className={clsx(
          'w-full flex lg:flex-row flex-col gap-16 p-4',
          'lg:justify-between justify-center flex-wrap items-center',
          'h-[calc(100%-100px)]'
        )}
      >
        <div className='flex flex-col gap-4 items-center mx-auto select-none'>
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
      <footer className='flex gap-4 p-4 justify-center items-center text-ui-400'>
        <p>&copy; 2026 Graplet</p>
        <Link
          href='https://github.com/graplet'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Github />
        </Link>
      </footer>
    </div>
  )
}
