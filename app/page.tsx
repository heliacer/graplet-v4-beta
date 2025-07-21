'use client'

import { ArrowRight, Mail } from "lucide-react"
import EarlyAccessLogo from "./ui/ea-logo"
import { useState } from "react"

export default function Home() {
  function doNothing() {
    console.log('hello')
  }

  return (
    <div className="font-light flex gap-5 flex-col justify-center items-center min-h-screen bg-radial">
      <EarlyAccessLogo size={90}/>
      <p className="italic">Early Access.</p>
      <div className="relative group">
        <button 
          onClick={doNothing}
          // styling not done yet, will depend on zod; checking if the input is valid / not.
          className={`cursor-not-allowed absolute focus:bg-zinc-800 focus:border-zinc-700 border-zinc-700 group-focus-within:bg-zinc-700 group-focus-within:border-zinc-600 right-2 self-center border px-2.5 py-0.5 rounded-full`}
          disabled
        >
          <ArrowRight size={18} />
        </button>
        <input
          className="w-96 max-w-xl pr-12 border py-1.5 pl-3 rounded-full border-zinc-700 truncate focus:outline-none focus:bg-zinc-800"
          type="text"
          placeholder="Enter granted Email"
        />
      </div>
      <div className="flex gap-2.5 items-center">
        <Mail size={14} />
        <p>Invitation only</p>
      </div>
    </div>
  )
}
