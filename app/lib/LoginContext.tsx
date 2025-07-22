import { createContext, useContext } from 'react'

export const LoginContext = createContext<{
  email: string
  setEmail: (email: string) => void
  password: string
  setPassword: (password: string) => void
}>({
  email: '',
  setEmail: () => {},
  password: '',
  setPassword: () => {}
})

export const useLogin = () => useContext(LoginContext)