import { ArrowRight, LoaderCircle } from "lucide-react"

export default function SubmitButton({
  value,
  isFocussed,
  isLoading
}: {
  value: string
  isFocussed: boolean
  isLoading: boolean
}) {
  const buttonClasses = [
    'absolute right-2 bottom-[7px] border px-2 py-0.5 rounded-full',
    value
      ? isFocussed
        ? 'dark:bg-zinc-700 dark:border-zinc-500 bg-zinc-300 border-zinc-500'
        : 'dark:bg-zinc-800 dark:border-zinc-600 bg-zinc-200 border-zinc-400 '
      : isFocussed
        ? 'dark:border-zinc-600 border-zinc-500'
        : 'dark:border-zinc-700 border-zinc-400',
    !isLoading && 'cursor-pointer'
  ].join(' ')


  return (
    <button type='submit' className={buttonClasses} disabled={isLoading}>
      {isLoading ? <LoaderCircle className='animate-spin' size={18} /> : <ArrowRight size={18} />}
    </button>
  )
}