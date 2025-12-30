import clsx from 'clsx'
import { ArrowRight, LoaderCircle } from 'lucide-react'

export function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <button
      type='submit'
      className={clsx(
        'absolute right-2 bottom-1.75 border px-2 py-0.5 rounded-full',
        'bg-ui-800 border-ui-600',
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
