import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      
      const protectedPaths = ['/editor', '/mystuff']
      const isOnProtected = protectedPaths.some(path => 
        nextUrl.pathname.startsWith(path)
      )
      
      if (isOnProtected) {
        return isLoggedIn
      }
      
      if (isLoggedIn && nextUrl.pathname.startsWith('/login')) {
        return Response.redirect(new URL('/mystuff', nextUrl))
      }
      
      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig