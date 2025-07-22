'use client'

// Unstable testing

import { AlertTriangle, ArrowRight, Check, LoaderCircle, Mail } from "lucide-react"
import { useRouter } from "next/router"
import { FormEvent, useEffect, useState } from "react"
import { useLogin } from "../app/lib/LoginContext"

export default function Login(){
  const [isFocussedEmail, setIsFocussedEmail] = useState(false)
  const [canSubmitEmail, setCanSubmitEmail] = useState(false)
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")

  // NEW
  const {email,setEmail} = useLogin()
  const router = useRouter()

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("")
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [error])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("pending")

    const formData = new FormData(event.currentTarget)
    const emailInput = formData.get("email")?.toString()
    const passwordInput = formData.get("password")?.toString()

    if (emailInput) {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {
        console.log("proceed to server checks.")
        // simulate db fetch
        setTimeout(() => {
          // UI Testing, bypass
          setStatus("ok")
          router.push("/login/password")
        }, 3000)
      } else {
        setStatus("")
        setError("Invalid Email.")
      }
    } else {
      setStatus("")
      setError("Email cannot be empty.")
    }
  }

  const buttonClasses = [
    "absolute right-2 top-[7px] border px-2.5 py-0.5 rounded-full focus:outline-none",
    email.canSubmitEmail
      ? email.isFocussedEmail
        ? "bg-zinc-700 border-zinc-500"
        : "bg-zinc-800 border-zinc-600"
      : email.isFocussedEmail
        ? "border-zinc-600"
        : "border-zinc-700",
    !email.status && "cursor-pointer"
  ].join(" ")


    return (
      <>
      <form
        className="relative flex flex-col gap-2.5 w-96"
        id="login-form"
        onSubmit={(e) => handleSubmit(e)}
        noValidate
      >
        <input
          name="email"
          className="w-full pr-12 border py-1.5 pl-3 rounded-full border-zinc-700 truncate focus:outline-none focus:bg-zinc-800 focus:border-zinc-600"
          placeholder="Enter granted Email"
          onChange={(e) => setCanSubmitEmail(!!e.target.value)}
          onFocus={() => setIsFocussedEmail(true)}
          onBlur={() => setIsFocussedEmail(false)}
          type="email"
          inputMode="email"
          autoComplete="off"
        />
        <button type="submit" className={buttonClasses} disabled={email.status !== ''}>
            {email.status === 'pending' ? <LoaderCircle className="animate-spin" size={18} /> : email.status === 'ok' ? <Check size={18}/> : <ArrowRight size={18} />}
        </button> 
      </form>
        {
      error ? (
        <div className="flex gap-2.5 items-center animate-shake">
          <AlertTriangle size={14} className="text-red-400" />
          <p className="text-red-400">{error}</p>
        </div>
      ) : (
        <div className="flex gap-2.5 items-center">
          <Mail size={14} />
          <p>Invitation only.</p>
        </div>
      )
      }
      </>
    )
}