'use client'

import { LogoSolid } from '../lib/components/LogoSolid'
import { clsx } from 'clsx'
import Link from 'next/link'
import { useActionState } from 'react'
import { credentialsSignIn } from '@/app/lib/data/actions'
import { KeyRound, Mail } from 'lucide-react'
import { Github } from '../lib/components/icons/Github'
import { Google } from '../lib/components/icons/Google'

export default function Login() {
  const [state, formAction, pending] = useActionState(credentialsSignIn, {
    success: true
  })

  return (
    <form
      action={formAction}
      className='w-full mt-20 flex flex-col gap-2 items-center'
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
            'border rounded-md py-1.75 w-90 px-2.5 mb-3',
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
          'cursor-pointer active:scale-95'
        )}
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>

      <div className='flex items-center gap-2'>
        <hr className='w-6 border-ui-600' />
        <p>or</p>
        <hr className='w-6 border-ui-600' />
      </div>
      <div className='flex gap-4 w-90 mb-2'>
        <button
          type='button'
          className={clsx(
            'flex gap-2 items-center w-full',
            'border rounded-md py-1.75 px-2.5',
            'border-ui-600 bg-ui-800 hover:border-ui-550',
            'cursor-not-allowed'
          )}
        >
          <Mail size={20} />
          <p>Send me an Email</p>
        </button>
        <button
          type='button'
          className={clsx(
            'flex gap-2 items-center',
            'border rounded-md py-1.75 px-4',
            'border-ui-600 bg-ui-800 hover:border-ui-550',
            'cursor-not-allowed'
          )}
        >
          <Github size={22} />
        </button>
        <button
          type='button'
          className={clsx(
            'flex gap-2 items-center',
            'border rounded-md py-1.75 px-4',
            'border-ui-600 bg-ui-800 hover:border-ui-550',
            'cursor-not-allowed'
          )}
        >
          <Google size={22} />
        </button>
      </div>
      <button
        type='button'
        className={clsx(
          'flex gap-2 items-center justify-center',
          'border rounded-md py-1.75 px-2.5 w-90',
          'border-ui-600 bg-ui-800 hover:border-ui-550',
          'cursor-not-allowed mb-1'
        )}
      >
        <KeyRound size={20} />
        <p>Continue with Passkey</p>
      </button>
      <div className='flex gap-1 text-sm'>
        <p className='text-ui-300'>New to Graplet?</p>
        <Link href='/signup' className='text-teal hover:underline'>
          Create an account
        </Link>
      </div>
    </form>
  )
}
