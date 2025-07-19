import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      profile?: any
    } & DefaultSession['user']
  }

  interface User {
    role?: string
    profile?: any
  }
}