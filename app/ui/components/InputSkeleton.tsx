import { Mail } from "lucide-react"

export default function InputSkeleton() {
  return (
    <>
      <input disabled className="w-80 pr-12 py-1.5 pl-3 border rounded-full dark:border-zinc-700 border-zinc-400 dark:bg-zinc-800 bg-zinc-200" />
      <div className='flex gap-2.5 items-center'>
        <Mail size={14} />
        <p>Invitation only.</p>
      </div>
      <span className="h-7"></span>
    </>
  )
} 