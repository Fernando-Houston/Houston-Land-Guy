import { NextResponse } from 'next/server'

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export function handleAPIError(error: unknown) {
  console.error('API Error:', error)
  
  if (error instanceof APIError) {
    return NextResponse.json(
      { 
        error: error.message, 
        code: error.code 
      },
      { status: error.statusCode }
    )
  }
  
  if (error instanceof Error) {
    return NextResponse.json(
      { 
        error: error.message,
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    )
  }
  
  return NextResponse.json(
    { 
      error: 'Internal server error',
      code: 'UNKNOWN_ERROR'
    },
    { status: 500 }
  )
}