import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      firstName: string
      lastName: string
      userType: 'buyer' | 'seller' | 'agent' | 'investor'
    } & DefaultSession['user']
  }

  interface User {
    role?: string
    firstName?: string
    lastName?: string
    userType?: 'buyer' | 'seller' | 'agent' | 'investor'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
    firstName?: string
    lastName?: string
    userType?: 'buyer' | 'seller' | 'agent' | 'investor'
  }
}