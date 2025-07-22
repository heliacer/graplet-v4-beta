'use client'

import { useState } from 'react'
import { LoginContext } from '../lib/LoginContext'
import EarlyAccessLogo from '../ui/ea-logo'

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <main className='flex gap-5 flex-col justify-center items-center min-h-screen'>
      <EarlyAccessLogo size={90} />
      <p className='italic'>Early Access.</p>
      <LoginContext.Provider value={{ email, setEmail, password, setPassword }}>
        {children}
      </LoginContext.Provider>
    </main>
  );
}
