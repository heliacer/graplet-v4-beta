'use client'

import { ArrowRight, Mail } from "lucide-react"
import { useState } from "react"
import EarlyAccessLogo from "./ui/ea-logo"

export default function Home() {
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [email, setEmail] = useState("")

  const canPress = false // if email is valid, later determined by zod

  function handleClick() {
    console.log('clicked')
  }

  const buttonClasses = [
    "absolute right-2 border px-2.5 py-0.5 rounded-full self-center focus:outline-none",
    canPress
      ? isInputFocused
        ? "bg-zinc-700 border-zinc-500"
        : "bg-zinc-800 border-zinc-600"
      : isInputFocused
        ? "border-zinc-600"
        : "border-zinc-700",
    "cursor-pointer"
  ].join(" ")

  return (
    <div className="font-light flex gap-5 flex-col justify-center items-center min-h-screen bg-radial">
      <EarlyAccessLogo size={90} />
      <p className="italic">Early Access.</p>

      <div className="relative">
        <input
          className="w-96 max-w-xl pr-12 border py-1.5 pl-3 rounded-full border-zinc-700 truncate focus:outline-none focus:bg-zinc-800 focus:border-zinc-600"
          type="text"
          placeholder="Enter granted Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />
        <button onClick={handleClick} className={buttonClasses}>
          <ArrowRight size={18} />
        </button>
      </div>
      <div className="flex gap-2.5 items-center">
        <Mail size={14} />
        <p>Invitation only</p>
      </div>
    </div>
  )
}
