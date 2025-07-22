'use client'

import { AlertTriangle, ArrowRight, LoaderCircle, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { useLogin } from '../lib/LoginContext'

export default function Login(){  
  const {email,setEmail} = useLogin()
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isFocussedEmail, setIsFocussedEmail] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [message])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    if (email) {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        console.log('proceed to server checks.')
        // Simulate DB Fetch
        setTimeout(() => {
          // UI Testing, bypass
          router.push('/login/password')
        }, 1000)
      } else {
        setIsLoading(false)
        setMessage('Invalid Email.')
      }
    } else {
      setIsLoading(false)
      setMessage('Email cannot be empty.')
    }
  }

  const buttonClasses = [
    'absolute right-2 top-[7px] border px-2 py-0.5 rounded-full focus:outline-none',
    email
      ? isFocussedEmail
        ? 'bg-zinc-700 border-zinc-500'
        : 'bg-zinc-800 border-zinc-600'
      : isFocussedEmail
        ? 'border-zinc-600'
        : 'border-zinc-700',
    !isLoading && 'cursor-pointer'
  ].join(' ')

    return (
      <>
      <form
        className='relative flex flex-col gap-2.5 w-80'
        id='login-form'
        onSubmit={(e) => handleSubmit(e)}
        noValidate
      >
        <input
          name='email'
          className='w-full pr-12 border py-1.5 pl-3 rounded-full border-zinc-700 truncate focus:outline-none focus:bg-zinc-800 focus:border-zinc-600'
          placeholder='Enter granted Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setIsFocussedEmail(true)}
          onBlur={() => setIsFocussedEmail(false)}
          type='email'
          inputMode='email'
          autoComplete='off'
        />
        <button type='submit' className={buttonClasses} disabled={isLoading}>
            {isLoading ? <LoaderCircle className='animate-spin' size={18} /> : <ArrowRight size={18} />}
        </button> 
      </form>
      {message ? 
        <div className='flex gap-2.5 items-center animate-shake'>
          <AlertTriangle size={14} className='text-red-400' />
          <p className='text-red-400'>{message}</p>
        </div>
      : 
        <div className='flex gap-2.5 items-center'>
          <Mail size={14} />
          <p>Invitation only.</p>
        </div>}
        <span className='h-7'></span>
      </>
    )
}