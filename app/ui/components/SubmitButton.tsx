import clsx from 'clsx'
import { ArrowRight, LoaderCircle } from 'lucide-react'

export function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <button
      type='submit'
      className={clsx(
        'absolute right-2 bottom-1.75 border px-2 py-1 rounded-full',
        'transition bg-ui-800 border-ui-600',
        'hover:border-ui-550 hover:bg-ui-750',
        !isLoading && 'cursor-pointer'
      )}
      disabled={isLoading}
    >
      {isLoading ? (
        <LoaderCircle className='animate-spin' size={14} />
      ) : (
        <ArrowRight size={14} />
      )}
    </button>
  )
}
