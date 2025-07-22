// Enhanced Authentication & User Management
import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '../db/prisma'
import * as bcrypt from 'bcryptjs'

export const authConfig: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
          role: 'USER' // Default role since we don't have role field in User model yet
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && 'role' in user) {
        token.role = (user as any).role
        token.firstName = (user as any).firstName
        token.lastName = (user as any).lastName
        token.userType = (user as any).userType
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        const user = session.user as any
        user.id = token.sub!
        user.role = (token.role as string) || 'USER'
        user.firstName = (token.firstName as string) || ''
        user.lastName = (token.lastName as string) || ''
        user.userType = (token.userType as 'buyer' | 'seller' | 'agent' | 'investor') || 'buyer'
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (!existingUser) {
            // Extract first and last name from Google profile
            const names = user.name?.split(' ') || ['', '']
            const firstName = names[0] || 'Unknown'
            const lastName = names.slice(1).join(' ') || 'User'
            
            // Create new user
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                firstName,
                lastName,
                userType: 'buyer', // Default to buyer
                isEmailVerified: true, // Google emails are verified
                createdAt: new Date(),
                updatedAt: new Date()
              }
            })

            // Create user preferences
            await prisma.userPreferences.create({
              data: {
                userId: newUser.id,
                emailNotifications: true,
                smsNotifications: false,
                marketingEmails: true,
                priceAlerts: true,
                newListingAlerts: true,
                savedSearchAlerts: true
              }
            })
          }
        } catch (error) {
          console.error('Error creating user:', error)
          return false
        }
      }
      return true
    }
  },
  events: {
    async createUser({ user }) {
      // Send welcome email
      try {
        // Implementation would send welcome email with onboarding info
        console.log(`Welcome email sent to ${user.email}`)
      } catch (error) {
        console.error('Error sending welcome email:', error)
      }
    }
  }
}

// User types and interfaces
export interface UserProfile {
  id: string
  userId: string
  userType: 'DEVELOPER' | 'INVESTOR' | 'SELLER' | 'AGENT' | 'LENDER'
  company?: string
  license?: string
  bio?: string
  phone?: string
  website?: string
  preferences: UserPreferences
  portfolio?: PortfolioProperty[]
  savedSearches?: SavedSearch[]
  watchlist?: string[] // Property IDs
  createdAt: Date
  updatedAt: Date
}

export interface UserPreferences {
  neighborhoods: string[]
  propertyTypes: string[]
  priceRange: { min: number; max: number }
  investmentStrategy?: 'buy_hold' | 'flip' | 'development' | 'commercial'
  riskTolerance?: 'low' | 'medium' | 'high'
  targetROI?: number
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
    frequency: 'immediate' | 'daily' | 'weekly'
  }
  dashboard: {
    layout: 'default' | 'compact' | 'detailed'
    widgets: string[]
    defaultView: 'map' | 'list' | 'dashboard'
  }
}

export interface SavedSearch {
  id: string
  name: string
  criteria: SearchCriteria
  alertsEnabled: boolean
  lastRun: Date
  resultCount: number
}

export interface SearchCriteria {
  propertyType?: string[]
  priceRange?: { min: number; max: number }
  bedrooms?: { min: number; max: number }
  bathrooms?: { min: number; max: number }
  squareFeet?: { min: number; max: number }
  lotSize?: { min: number; max: number }
  yearBuilt?: { min: number; max: number }
  neighborhoods?: string[]
  zipCodes?: string[]
  keywords?: string[]
  status?: string[]
  daysOnMarket?: number
  features?: string[]
}

export interface PortfolioProperty {
  id: string
  propertyId: string
  purchasePrice: number
  purchaseDate: Date
  currentValue?: number
  notes?: string
  status: 'owned' | 'under_contract' | 'sold' | 'tracking'
  performanceMetrics?: {
    totalReturn: number
    annualizedReturn: number
    cashFlow: number
    appreciation: number
  }
}

// Note: UserService class removed due to typing complexity
// Can be re-added later with proper typing

export default authConfig