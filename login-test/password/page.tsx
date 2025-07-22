'use client'

import { Pen } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Password(){
    const router = useRouter()

    return (
        <>
            <button
                type="reset"
                onClick={() => router.push('/login')}
                className="cursor-pointer bg-zinc-800 border-zinc-600 absolute right-2 top-[7px] border px-2.5 py-0.5 rounded-full focus:outline-none"
            >
                <Pen size={18}/>
            </button>
            <input
                name="password"
                className="w-full pr-12 border py-1.5 pl-3 rounded-full border-zinc-700 truncate focus:outline-none focus:bg-zinc-800 focus:border-zinc-600"
                placeholder="Enter Password"
                type="password"
                autoComplete="off"
            />
        </>
    )
}