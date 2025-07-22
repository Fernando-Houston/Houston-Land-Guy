import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Validation schema for signup
const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  userType: z.enum(['buyer', 'seller', 'agent', 'investor']).default('buyer'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input
    const validationResult = signupSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.errors
      }, { status: 400 })
    }

    const { email, password, firstName, lastName, phone, userType } = validationResult.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'User with this email already exists'
      }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        userType,
        isEmailVerified: false, // Will need email verification
        createdAt: new Date(),
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        userType: true,
        isEmailVerified: true,
        createdAt: true
      }
    })

    // Create user preferences
    await prisma.userPreferences.create({
      data: {
        userId: user.id,
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: true,
        priceAlerts: true,
        newListingAlerts: true,
        savedSearchAlerts: true
      }
    })

    // Create user profile with phone if provided
    if (phone) {
      await prisma.userProfile.create({
        data: {
          userId: user.id,
          userType: userType.toUpperCase(),
          phone: phone
        }
      })
    }

    // Log user registration for analytics
    console.log(`New user registered: ${user.email} (${user.userType})`)

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
          isEmailVerified: user.isEmailVerified
        }
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Signup error:', error)
    
    // Handle Prisma specific errors
    if (error.code === 'P2002') {
      return NextResponse.json({
        success: false,
        error: 'Email address is already registered'
      }, { status: 409 })
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error during account creation'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}