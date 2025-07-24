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
        ? 'bg-zinc-700 border-zinc-500'
        : 'bg-zinc-800 border-zinc-600'
      : isFocussed
        ? 'border-zinc-600'
        : 'border-zinc-700',
    !isLoading && 'cursor-pointer'
  ].join(' ')


  return (
    <button type='submit' className={buttonClasses} disabled={isLoading}>
      {isLoading ? <LoaderCircle className='animate-spin' size={18} /> : <ArrowRight size={18} />}
    </button>
  )
}