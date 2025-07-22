import { createContext, useContext } from "react"

export const LoginContext = createContext<{
  email: string
  setEmail: (email: string) => void
}>({
  email: "",
  setEmail: () => {},
})

export const useLogin = () => useContext(LoginContext)