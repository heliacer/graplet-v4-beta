'use client'

import { Cuboid, LogOut } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

export default function MyStuff() {
    const { data: session } = useSession()
    
    return (
        <main className="flex flex-col gap-4 justify-center items-center min-h-screen">
            <p className="text-xl">My Stuff</p>
            {session?.user?.email && (
                <p>Welcome, {session.user.email}</p>
            )}
            <Link className='flex items-center gap-1' href='/editor'>
                <Cuboid size={18}/>
                <p>Go to Editor</p>
            </Link>
            <button className="cursor-pointer flex items-center gap-2" onClick={() => signOut({ callbackUrl: '/' })}>
                <p>Sign Out</p>
                <LogOut size={18} />
            </button>
        </main>
    )
}