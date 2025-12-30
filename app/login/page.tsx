'use client'

import { AlertTriangle, Mail } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { SubmitButton } from '../ui/components/SubmitButton'
import { CredentialsInput } from '../ui/components/CredentialsInput'
import { checkEmail } from '../lib/actions'

export default function Login() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { replace } = useRouter()

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

    if (email) {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase())) {
        const response = await checkEmail(email.toLowerCase())

        if (response.status === 'ok') {
          const params = new URLSearchParams(searchParams)
          params.set('email', email)

          if (response.message === 'continue') {
            replace(`${pathname}/password?${params.toString()}`)
          } else {
            replace(`signup/password?${params.toString()}`)
          }
        } else {
          setIsLoading(false)
          setMessage(response.message)
        }
      } else {
        setIsLoading(false)
        setMessage('Invalid Email.')
      }
    } else {
      setIsLoading(false)
      setMessage('Email required.')
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
        <CredentialsInput
          placeholder='Enter granted Email'
          type='email'
          value={email}
          setValue={setEmail}
        />
        <SubmitButton isLoading={isLoading} />
      </form>
      {message ? (
        <div className='flex gap-2.5 items-center'>
          <AlertTriangle size={14} className='text-red' />
          <p className='text-red'>{message}</p>
        </div>
      ) : (
        <div className='flex gap-2.5 items-center'>
          <Mail size={14} />
          <p>Invitation only.</p>
        </div>
      )}
      <span className='h-7'></span>
    </>
  )
}
