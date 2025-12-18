import clsx from 'clsx'
import { ArrowRight, LoaderCircle } from 'lucide-react'

export default function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <button
      type='submit'
      className={clsx(
        'absolute right-2 bottom-[7px] border px-2 py-0.5 rounded-full border-zinc-400',
        'dark:bg-zinc-800 dark:border-zinc-600',
        !isLoading && 'cursor-pointer'
      )}
      disabled={isLoading}
    >
      {isLoading ? (
        <LoaderCircle className='animate-spin' size={18} />
      ) : (
        <ArrowRight size={18} />
      )}
    </button>
  )
}
