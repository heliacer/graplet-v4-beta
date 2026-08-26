import { genSalt, hash } from 'bcrypt'
import { usersTable } from './schema'
import { db } from './db'

const saltRounds = 10

export async function getUser(identifier: string) {
  return await db.query.usersTable.findFirst({
    where: { OR: [{ email: identifier }, { name: identifier }] }
  })
}

export async function createUser(
  email: string,
  name: string,
  password?: string
) {
  const salt = await genSalt(saltRounds)
  const user: typeof usersTable.$inferInsert = { email, name }

  if (password) {
    user.passwordHash = await hash(password, salt)
  }

  return await db.insert(usersTable).values(user)
}
