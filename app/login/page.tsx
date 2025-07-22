'use client'

import { ArrowRight, Check, LoaderCircle } from "lucide-react"
import { useContext } from "react"
import { EmailContext } from "./layout"

export default function Login(){
  const email = useContext(EmailContext)

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
        <button type="submit" className={buttonClasses} disabled={email.status !== ''}>
            {email.status === 'pending' ? <LoaderCircle className="animate-spin" size={18} /> : email.status === 'ok' ? <Check size={18}/> : <ArrowRight size={18} />}
        </button> 
    )
}