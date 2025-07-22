import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import crypto from 'crypto'

const prisma = new PrismaClient()

// Validation schema for forgot password
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input
    const validationResult = forgotPasswordSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email address'
      }, { status: 400 })
    }

    const { email } = validationResult.data

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    // Always return success for security (don't reveal if email exists)
    const successResponse = {
      success: true,
      message: 'If an account with that email exists, we sent a password reset link'
    }

    if (!user) {
      // Log the attempt but still return success
      console.log(`Password reset attempted for non-existent email: ${email}`)
      return NextResponse.json(successResponse)
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    // Save reset token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
        updatedAt: new Date()
      }
    })

    // In a real app, you'd send an email here
    // For now, we'll log the reset link (in production, remove this!)
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`
    console.log(`Password reset requested for ${email}`)
    console.log(`Reset URL: ${resetUrl}`)

    // TODO: Send actual email
    // await sendPasswordResetEmail(user.email, resetUrl)

    return NextResponse.json(successResponse)

  } catch (error) {
    console.error('Forgot password error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error while processing password reset'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// Route for resetting password with token
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    
    const resetSchema = z.object({
      token: z.string().min(1, 'Reset token is required'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
    })

    const validationResult = resetSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.errors
      }, { status: 400 })
    }

    const { token, password } = validationResult.data

    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date() // Token not expired
        }
      }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid or expired reset token'
      }, { status: 400 })
    }

    // Hash new password
    const { hash } = await import('bcryptjs')
    const hashedPassword = await hash(password, 12)

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        updatedAt: new Date()
      }
    })

    console.log(`Password reset completed for user: ${user.email}`)

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully'
    })

  } catch (error) {
    console.error('Password reset error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error while resetting password'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}