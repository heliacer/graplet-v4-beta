export interface UserT {
  id: string
  email: string
  name: string
  password: string
  createdAt?: Date
}

export type Optional<T, K extends keyof T> = T extends unknown
  ? Omit<T, K> & Partial<Pick<T, K>>
  : never
