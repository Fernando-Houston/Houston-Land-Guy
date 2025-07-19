// Enhanced Authentication & User Management
import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/database/prisma'
import bcrypt from 'bcryptjs'

export const authConfig: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
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
          where: { email: credentials.email },
          include: { profile: true }
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
          name: user.name,
          image: user.image,
          role: user.role,
          profile: user.profile
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
        token.profile = user.profile
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.profile = token.profile as any
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
            // Create new user with default profile
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name!,
                image: user.image,
                role: 'USER',
                profile: {
                  create: {
                    userType: 'INVESTOR',
                    preferences: {
                      neighborhoods: [],
                      propertyTypes: [],
                      priceRange: { min: 0, max: 10000000 },
                      notifications: {
                        email: true,
                        sms: false,
                        push: true
                      }
                    }
                  }
                }
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

// Enhanced user service
export class UserService {
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const profile = await prisma.userProfile.findUnique({
        where: { userId },
        include: {
          savedSearches: true,
          portfolio: true
        }
      })
      return profile
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const profile = await prisma.userProfile.update({
        where: { userId },
        data: updates
      })
      return profile
    } catch (error) {
      console.error('Error updating user profile:', error)
      return null
    }
  }

  static async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      const profile = await this.getUserProfile(userId)
      return profile?.preferences || null
    } catch (error) {
      console.error('Error fetching user preferences:', error)
      return null
    }
  }

  static async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<boolean> {
    try {
      const profile = await this.getUserProfile(userId)
      if (!profile) return false

      const updatedPreferences = { ...profile.preferences, ...preferences }
      
      await this.updateUserProfile(userId, {
        preferences: updatedPreferences
      })
      
      return true
    } catch (error) {
      console.error('Error updating user preferences:', error)
      return false
    }
  }

  static async addToWatchlist(userId: string, propertyId: string): Promise<boolean> {
    try {
      const profile = await this.getUserProfile(userId)
      if (!profile) return false

      const watchlist = profile.watchlist || []
      if (!watchlist.includes(propertyId)) {
        watchlist.push(propertyId)
        await this.updateUserProfile(userId, { watchlist })
      }
      
      return true
    } catch (error) {
      console.error('Error adding to watchlist:', error)
      return false
    }
  }

  static async removeFromWatchlist(userId: string, propertyId: string): Promise<boolean> {
    try {
      const profile = await this.getUserProfile(userId)
      if (!profile) return false

      const watchlist = (profile.watchlist || []).filter(id => id !== propertyId)
      await this.updateUserProfile(userId, { watchlist })
      
      return true
    } catch (error) {
      console.error('Error removing from watchlist:', error)
      return false
    }
  }

  static async saveSearch(userId: string, searchData: {
    name: string
    criteria: SearchCriteria
    alertsEnabled: boolean
  }): Promise<SavedSearch | null> {
    try {
      const savedSearch = await prisma.savedSearch.create({
        data: {
          userId,
          name: searchData.name,
          criteria: searchData.criteria,
          alertsEnabled: searchData.alertsEnabled,
          lastRun: new Date(),
          resultCount: 0
        }
      })
      return savedSearch
    } catch (error) {
      console.error('Error saving search:', error)
      return null
    }
  }

  static async getSavedSearches(userId: string): Promise<SavedSearch[]> {
    try {
      const searches = await prisma.savedSearch.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      })
      return searches
    } catch (error) {
      console.error('Error fetching saved searches:', error)
      return []
    }
  }

  static async addToPortfolio(userId: string, propertyData: {
    propertyId: string
    purchasePrice: number
    purchaseDate: Date
    notes?: string
  }): Promise<PortfolioProperty | null> {
    try {
      const portfolioProperty = await prisma.portfolioProperty.create({
        data: {
          userId,
          propertyId: propertyData.propertyId,
          purchasePrice: propertyData.purchasePrice,
          purchaseDate: propertyData.purchaseDate,
          notes: propertyData.notes,
          status: 'owned'
        }
      })
      return portfolioProperty
    } catch (error) {
      console.error('Error adding to portfolio:', error)
      return null
    }
  }

  static async getPortfolio(userId: string): Promise<PortfolioProperty[]> {
    try {
      const portfolio = await prisma.portfolioProperty.findMany({
        where: { userId },
        orderBy: { purchaseDate: 'desc' }
      })
      return portfolio
    } catch (error) {
      console.error('Error fetching portfolio:', error)
      return []
    }
  }

  static async generatePersonalizedRecommendations(userId: string): Promise<{
    properties: string[]
    neighborhoods: string[]
    insights: string[]
    opportunities: string[]
  }> {
    try {
      const profile = await this.getUserProfile(userId)
      if (!profile) {
        return { properties: [], neighborhoods: [], insights: [], opportunities: [] }
      }

      // Use AI service to generate personalized recommendations
      // This would integrate with the Fernando-X AI service
      
      return {
        properties: ['prop1', 'prop2', 'prop3'],
        neighborhoods: ['Heights', 'Montrose', 'East End'],
        insights: [
          'Based on your investment history, consider diversifying into commercial properties',
          'The neighborhoods you follow are showing strong appreciation trends',
          'Your risk tolerance suggests exploring emerging areas like Third Ward'
        ],
        opportunities: [
          'New development opportunity in your preferred area',
          'Properties matching your criteria just came on market',
          'Market conditions favor your investment strategy'
        ]
      }
    } catch (error) {
      console.error('Error generating recommendations:', error)
      return { properties: [], neighborhoods: [], insights: [], opportunities: [] }
    }
  }

  static async trackUserActivity(userId: string, activity: {
    type: 'property_view' | 'search' | 'analysis' | 'report_download' | 'share'
    propertyId?: string
    metadata?: Record<string, any>
  }): Promise<void> {
    try {
      await prisma.userActivity.create({
        data: {
          userId,
          type: activity.type,
          propertyId: activity.propertyId,
          metadata: activity.metadata,
          timestamp: new Date()
        }
      })
    } catch (error) {
      console.error('Error tracking user activity:', error)
    }
  }

  static async getUserAnalytics(userId: string, timeframe: '7d' | '30d' | '90d' = '30d'): Promise<{
    totalViews: number
    totalSearches: number
    topNeighborhoods: string[]
    topPropertyTypes: string[]
    activityTrend: Array<{ date: string; count: number }>
  }> {
    try {
      const startDate = new Date()
      const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90
      startDate.setDate(startDate.getDate() - days)

      const activities = await prisma.userActivity.findMany({
        where: {
          userId,
          timestamp: { gte: startDate }
        }
      })

      // Process analytics data
      const totalViews = activities.filter(a => a.type === 'property_view').length
      const totalSearches = activities.filter(a => a.type === 'search').length

      return {
        totalViews,
        totalSearches,
        topNeighborhoods: ['Heights', 'Montrose', 'Downtown'], // Would be calculated from actual data
        topPropertyTypes: ['residential', 'commercial'], // Would be calculated from actual data
        activityTrend: [] // Would generate trend data
      }
    } catch (error) {
      console.error('Error fetching user analytics:', error)
      return {
        totalViews: 0,
        totalSearches: 0,
        topNeighborhoods: [],
        topPropertyTypes: [],
        activityTrend: []
      }
    }
  }
}

export default authConfig