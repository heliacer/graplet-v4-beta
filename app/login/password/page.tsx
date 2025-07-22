'use client'

import { useLogin } from '@/app/lib/LoginContext'
import { AlertTriangle, ArrowRight, Award, Eye, EyeClosed, LoaderCircle, Pen } from 'lucide-react'
import { notFound, useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'

export default function Password() {
  const { email, password, setPassword } = useLogin()
  if (!email) notFound()
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isFocussedPassword, setIsFocussedPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
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

    if (password) {
      // UI Testing, bypass
      if (password === '123456') {
        router.push('/editor')
      } else {
        setIsLoading(false)
        setMessage('Invalid password. 123456.')
      }
    } else {
      setIsLoading(false)
      setMessage('Password cannot be empty.')
    }
  }


  const buttonClassesSubmit = [
    'absolute right-2 bottom-[7px] border px-2 py-0.5 rounded-full focus:outline-none',
    password
      ? isFocussedPassword
        ? 'bg-zinc-700 border-zinc-500'
        : 'bg-zinc-800 border-zinc-600'
      : isFocussedPassword
        ? 'border-zinc-600'
        : 'border-zinc-700',
    !isLoading && 'cursor-pointer'
  ].join(' ')

  const buttonClassesView = [
    'absolute right-[50px] bottom-[7px] border px-2 py-0.5 rounded-full focus:outline-none',
    isFocussedPassword
      ? 'bg-zinc-700 border-zinc-500'
      : 'bg-zinc-800 border-zinc-600',
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
          value={email}
          autoComplete='off'
          disabled
        />
        <button
          type='reset'
          onClick={() => router.push('/login')}
          className='cursor-pointer bg-zinc-800 border-zinc-600 absolute right-2 top-[7px] border px-2 py-0.5 rounded-full focus:outline-none'
        >
          <Pen size={18} />
        </button>
        <input
          name='password'
          className='w-full pr-12 border py-1.5 pl-3 rounded-full border-zinc-700 truncate focus:outline-none focus:bg-zinc-800 focus:border-zinc-600'
          placeholder='Enter Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setIsFocussedPassword(true)}
          onBlur={() => setIsFocussedPassword(false)}
          type={showPassword ? 'text' : 'password'}
          autoComplete='off'
        />
        <button type='submit' className={buttonClassesSubmit} disabled={isLoading}>
          {isLoading ? <LoaderCircle className='animate-spin' size={18} /> : <ArrowRight size={18} />}
        </button>
        <button
          type='button'
          className={buttonClassesView}
          onClick={() => setShowPassword(prev => !prev)}
        >
          {showPassword ? <Eye size={18} /> : <EyeClosed size={18}/>}
        </button>
      </form>
      {message ?
        <div className='flex gap-2.5 items-center animate-shake'>
          <AlertTriangle size={14} className='text-red-400' />
          <p className='text-red-400'>{message}</p>
        </div>
        :
        <div className='flex gap-2.5 items-center'>
          <Award size={14} />
          <p>Welcome back.</p>
        </div>}
    </>
  )
}