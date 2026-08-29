'use client'

import { LogoSolid } from '../lib/components/LogoSolid'
import { clsx } from 'clsx'
import Link from 'next/link'
import { useActionState } from 'react'
import { credentialsSignIn } from '@/app/lib/data/actions'

export default function Login() {
  const [state, formAction, pending] = useActionState(credentialsSignIn, {
    success: true
  })

  return (
    <form
      action={formAction}
      className='w-full mt-20 flex flex-col gap-4 items-center'
    >
      <LogoSolid size={60} />
      <h1 className='text-xl mb-4'>Sign in to Graplet</h1>
      <label>
        <p className='text-sm mb-1'>Username or Email</p>
        <input
          autoFocus
          className={clsx(
            'border rounded-md py-1.75 w-90 px-2.5',
            'focus-visible:outline-1 focus-visible:outline-teal'
          )}
          type='text'
          name='identifier'
          autoComplete='username webauthn'
        />
      </label>
      <div>
        <div className='flex justify-between'>
          <label htmlFor='password' className='text-sm mb-1'>
            Password
          </label>
          <Link
            href='/forgot-password'
            className='text-sm mb-1 text-teal hover:underline'
          >
            Forgot password?
          </Link>
        </div>
        <input
          id='password'
          className={clsx(
            'border rounded-md py-2.75 w-90 px-2.5 mb-1',
            'focus-visible:outline-1 focus-visible:outline-teal'
          )}
          type='password'
          name='password'
          autoComplete='current-password webauthn'
        />
        {!state.success && <p className='text-sm text-red'>{state.message}</p>}
      </div>

      <button
        type='submit'
        disabled={pending}
        className={clsx(
          pending && 'opacity-80',
          'border rounded-md py-1.75 w-90 px-2.5',
          'border-teal bg-teal/60 hover:bg-teal/50',
          'cursor-pointer'
        )}
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
