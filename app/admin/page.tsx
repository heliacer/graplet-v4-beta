'use client'

import { Folder, LogOut, Plus } from "lucide-react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import CredentialsInput from "../ui/components/CredentialsInput"
import { FormEvent, useEffect, useState } from "react"
import { signUp } from "../lib/actions"

export default function Admin() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [message])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData)
    const response = await signUp({
      email: data.email as string,
      name: data.name as string,
      password: data.password as string
    })
    setMessage(response.message)
  }

  return (
    <main className="flex justify-center items-center min-h-screen">
      <div className="w-xl flex flex-wrap-reverse items-end justify-between gap-6 mx-10">
        <div className="flex min-h-52 flex-col gap-4">
          <p className="text-xl">Admin</p>
          <Link className='flex items-center gap-2' href='/mystuff'>
            <Folder size={18} />
            <p>Go to My Stuff</p>
          </Link>
          <button className="cursor-pointer flex items-center gap-2" onClick={() => signOut({ callbackUrl: '/' })}>
            <LogOut size={18} />
            <p>Sign Out</p>
          </button>
        </div>
        <form noValidate onSubmit={handleSubmit} className="flex items-center flex-col gap-2.5">
          <CredentialsInput name="email" type="email" />
          <CredentialsInput name="name" placeholder="username" />
          <CredentialsInput name="password" placeholder="password" />
          <button className="cursor-pointer flex items-center gap-2" type="submit">
            <Plus size={18} />
            <p>Create User</p>
          </button>
          <p>{message}</p>
        </form>
      </div>
    </main>
  )
}