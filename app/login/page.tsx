'use client'

import { LogoSolid } from '../lib/components/LogoSolid'
import { clsx } from 'clsx'
import Link from 'next/link'
import { useActionState, useState } from 'react'
import { signInAction } from '@/app/lib/data/actions'
import { KeyRound, Mail } from 'lucide-react'
import { Github } from '../lib/components/icons/Github'
import { Google } from '../lib/components/icons/Google'
import { signIn } from 'next-auth/react'
import { signIn as waSignIn } from 'next-auth/webauthn'

export default function Login() {
  const [state, formAction, pending] = useActionState(signInAction, {
    success: true
  })

  const [action, setAction] = useState<string | null>(null)

  async function handlePasskeySignIn() {
    setAction('passkey')
    try {
      await waSignIn('passkey', { redirectTo: '/editor' })
    } catch {
      setAction(null)
      return
    }
  }

  async function handleOAuth(provider: 'github' | 'google') {
    setAction(provider)
    await signIn(provider)
  }

  return (
    <form
      onSubmit={({ currentTarget, nativeEvent: { submitter } }) => {
        const action = (submitter as HTMLButtonElement).value
        const password = (
          currentTarget.elements.namedItem('password') as HTMLInputElement
        ).value

        setAction(!password && action === 'credentials' ? 'resend' : action)
      }}
      action={formAction}
      className='w-full mt-20 flex flex-col gap-2 items-center'
    >
      <LogoSolid size={60} />
      <h1 className='text-xl mb-4'>Sign in to Graplet</h1>
      <label>
        <p className='text-sm mb-1'>Username or Email*</p>
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
        name='action'
        value='credentials'
        className={clsx(
          pending && action === 'credentials'
            ? 'opacity-80'
            : 'cursor-pointer hover:bg-teal/50',
          'border rounded-md py-1.75 w-90 px-2.5',
          'border-teal bg-teal/60'
        )}
      >
        {pending && action === 'credentials' ? 'Signing in…' : 'Sign in'}
      </button>

      <div className='flex items-center gap-2'>
        <hr className='w-6 border-ui-600' />
        <p>or</p>
        <hr className='w-6 border-ui-600' />
      </div>
      <div className='flex gap-4 w-90 mb-2'>
        <button
          type='submit'
          name='action'
          value='resend'
          className={clsx(
            pending && action === 'resend'
              ? 'opacity-80'
              : 'cursor-pointer hover:border-ui-550',
            'flex gap-2 items-center w-full ',
            'border rounded-md py-1.75 px-2.5',
            'border-ui-600 bg-ui-800'
          )}
        >
          <Mail size={20} />
          <p>
            {pending && action === 'resend'
              ? 'Sending Email…'
              : 'Send me an Email'}
          </p>
        </button>
        <button
          type='button'
          onClick={() => handleOAuth('github')}
          className={clsx(
            action === 'github'
              ? 'opacity-80'
              : 'cursor-pointer hover:border-ui-550',
            'flex gap-2 items-center border rounded-md',
            'border-ui-600 py-1.75 px-4 bg-ui-800'
          )}
        >
          <Github size={22} />
        </button>
        <button
          type='button'
          onClick={() => handleOAuth('google')}
          className={clsx(
            action === 'google'
              ? 'opacity-80'
              : 'cursor-pointer hover:border-ui-550',
            'flex gap-2 items-center border rounded-md',
            'border-ui-600 py-1.75 px-4 bg-ui-800'
          )}
        >
          <Google size={22} />
        </button>
      </div>
      <button
        type='button'
        onClick={handlePasskeySignIn}
        className={clsx(
          action === 'passkey'
            ? 'opacity-80'
            : 'cursor-pointer hover:border-ui-550',
          'flex gap-2 items-center justify-center',
          'border rounded-md py-1.75 px-2.5 w-90 mb-1',
          'border-ui-600 bg-ui-800'
        )}
      >
        <KeyRound size={20} />
        <p>
          {action === 'passkey'
            ? 'Waiting for external interaction...'
            : 'Continue with Passkey'}
        </p>
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
