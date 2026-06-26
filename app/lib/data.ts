import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { genSalt, hash } from 'bcryptjs'

interface User {
  email: string
  name: string
  password: string
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })
const saltRounds = 10

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email }
  })
}

export async function createUser(user: User) {
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
