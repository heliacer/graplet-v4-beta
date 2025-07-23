'use client'

import { simulateLogIn } from '@/app/lib/actions'
import CredentialsInput from '@/app/ui/components/CredentialsInput'
import SubmitButton from '@/app/ui/components/SubmitButton'
import { AlertTriangle, Award, Eye, EyeClosed, Pen } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'

export default function Password() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [password,setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isFocussedPassword, setIsFocussedPassword] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [message])
  
  const email = searchParams.get('email')!

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    if (password) {
      // UI Testing, bypass
      if (password.length >= 6) {
        const response = await simulateLogIn(email, password)
        if (response.status === 'ok'){
          if (response.message === 'authorized'){
            router.push('/editor')
          }
          // else (future) router.push('/signup')
        } else {
          setIsLoading(false)
          setMessage(response.message)
        }
      } else {
        setIsLoading(false)
        setMessage('Password is too small.')
      }
    } else {
      setIsLoading(false)
      setMessage('Password cannot be empty.')
    }
  }

  const buttonClasses = [
    'absolute right-[50px] bottom-[7px] border px-2 py-0.5 rounded-full',
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
        <CredentialsInput type='email' value={email} disabled/>
        <button
          type='reset'
          onClick={() => router.push('/login')}
          className='cursor-pointer bg-zinc-800 border-zinc-600 absolute right-2 top-[7px] border px-2 py-0.5 rounded-full'
        >
          <Pen size={18} />
        </button>
        <CredentialsInput
          value={password}
          name='password'
          type={showPassword ? 'text' : 'password'}
          setValue={setPassword}
          setIsFocussed={setIsFocussedPassword}
        />
        <button
          type='button'
          className={buttonClasses}
          onClick={() => setShowPassword(prev => !prev)}
        >
          {showPassword ? <Eye size={18} /> : <EyeClosed size={18}/>}
        </button>
        <SubmitButton
          value={password}
          isFocussed={isFocussedPassword}
          isLoading={isLoading}
        />
      </form>
      {message ?
        <div className='flex gap-2.5 items-center'>
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