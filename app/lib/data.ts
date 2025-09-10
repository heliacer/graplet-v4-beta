import { PrismaClient } from '@prisma/client'
import { UserT } from './types'
import { genSalt, hash } from 'bcrypt'

const prisma = new PrismaClient()
const saltRounds = 10

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email }
  })
}

export async function createUser(user: Omit<UserT, 'id'>) {
  const salt = await genSalt(saltRounds)
  const hashedPassword = await hash(user.password, salt)
  return await prisma.user.create({
    data: {
      email: user.email,
      name: user.name,
      password: hashedPassword
    }
  })
}
