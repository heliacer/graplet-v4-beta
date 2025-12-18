'use client'

import { signIn } from 'next-auth/react'
import CredentialsInput from '@/app/ui/components/CredentialsInput'
import SubmitButton from '@/app/ui/components/SubmitButton'
import { AlertTriangle, Award, Eye, EyeClosed, Pen } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import clsx from 'clsx'

export default function Password() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState(false)

  const email = searchParams.get('email')!
  const callbackUrl = searchParams.get('callbackUrl') || '/mystuff'

  useEffect(() => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      router.push('/login')
    }
  }, [email, router])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [message])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    if (password) {
      if (password.length >= 6) {
        const result = await signIn('credentials', {
          email: email.toLowerCase(),
          password,
          redirect: false
        })

        if (result?.error) {
          console.log('Auth error:', result)
          setIsLoading(false)
          switch (result.code) {
            case 'invalid_credentials':
              setMessage('Invalid Credentials.')
              break
            case 'user_not_found':
              setMessage('Early Access Only.')
              break
            case 'incorrect_password':
              setMessage('Incorrect password.')
              break
            default:
              setMessage('Something went wrong.')
          }
        } else {
          router.push(callbackUrl)
        }
      } else {
        setIsLoading(false)
        setMessage('Password is too small.')
      }
    } else {
      setIsLoading(false)
      setMessage('Password required.')
    }
  }

  return (
    <>
      <form
        className='relative flex flex-col gap-2.5 w-80'
        id='login-form'
        onSubmit={handleSubmit}
        noValidate
      >
        <CredentialsInput type='email' value={email} disabled />
        <button
          type='reset'
          onClick={() => router.push('/login')}
          className={clsx(
            'absolute right-2 top-[7px] border px-2 py-0.5 rounded-full',
            'dark:bg-zinc-800 dark:border-zinc-600 border-zinc-400',
            !isLoading && 'cursor-pointer'
          )}
        >
          <Pen size={18} />
        </button>
        <CredentialsInput
          placeholder='Enter Password'
          value={password}
          name='password'
          type={showPassword ? 'text' : 'password'}
          setValue={setPassword}
        />
        <button
          type='button'
          className={clsx(
            'absolute right-[50px] bottom-[7px] border px-2 py-0.5 rounded-full',
            'dark:bg-zinc-800 dark:border-zinc-600 border-zinc-400',
            !isLoading && 'cursor-pointer'
          )}
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
        </button>
        <SubmitButton isLoading={isLoading} />
      </form>
      {message ? (
        <div className='flex gap-2.5 items-center'>
          <AlertTriangle size={14} className='text-red-400' />
          <p className='text-red-400'>{message}</p>
        </div>
      ) : (
        <div className='flex gap-2.5 items-center'>
          <Award size={14} />
          <p>Welcome back.</p>
        </div>
      )}
    </>
  )
}
