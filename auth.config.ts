import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login'
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user

      const protectedPaths = ['/editor', '/mystuff', '/account']
      const isOnProtected = protectedPaths.some(path =>
        nextUrl.pathname.startsWith(path)
      )

      const adminOnlyPaths = ['/admin']
      const isOnAdminOnly = adminOnlyPaths.some(path =>
        nextUrl.pathname.startsWith(path)
      )

      const isAdminUser = auth?.user?.email === 'heliacer@gmx.ch'

      if (isOnAdminOnly) {
        return isLoggedIn && isAdminUser
      }

      if (isOnProtected) {
        return isLoggedIn
      }

      if (isLoggedIn && nextUrl.pathname.startsWith('/login')) {
        return Response.redirect(new URL('/mystuff', nextUrl))
      }

      return true
    }
  },
  providers: []
} satisfies NextAuthConfig
