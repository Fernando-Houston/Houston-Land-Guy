import { prisma } from '@/lib/db/prisma'

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL'
}

export interface LogContext {
  userId?: string
  leadId?: string
  endpoint?: string
  method?: string
  statusCode?: number
  duration?: number
  error?: any
  metadata?: Record<string, any>
}

export class Logger {
  private static instance: Logger
  private isDevelopment = process.env.NODE_ENV === 'development'

  static getInstance(): Logger {
    if (!this.instance) {
      this.instance = new Logger()
    }
    return this.instance
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? JSON.stringify(context) : ''
    return `[${timestamp}] [${level}] ${message} ${contextStr}`
  }

  private async persistLog(level: LogLevel, message: string, context?: LogContext) {
    if (level === LogLevel.DEBUG && !this.isDevelopment) {
      return // Don't persist debug logs in production
    }

    try {
      // In production, you might want to send logs to an external service
      // For now, we'll store critical logs in the database
      if (level === LogLevel.ERROR || level === LogLevel.FATAL) {
        await prisma.interaction.create({
          data: {
            leadId: context?.leadId,
            type: 'system_error',
            details: {
              level,
              message,
              ...context,
              timestamp: new Date().toISOString()
            }
          }
        })
      }
    } catch (error) {
      // Fallback to console if database write fails
      console.error('Failed to persist log:', error)
    }
  }

  debug(message: string, context?: LogContext) {
    const formatted = this.formatMessage(LogLevel.DEBUG, message, context)
    console.debug(formatted)
  }

  info(message: string, context?: LogContext) {
    const formatted = this.formatMessage(LogLevel.INFO, message, context)
    console.info(formatted)
    this.persistLog(LogLevel.INFO, message, context)
  }

  warn(message: string, context?: LogContext) {
    const formatted = this.formatMessage(LogLevel.WARN, message, context)
    console.warn(formatted)
    this.persistLog(LogLevel.WARN, message, context)
  }

  error(message: string, context?: LogContext) {
    const formatted = this.formatMessage(LogLevel.ERROR, message, context)
    console.error(formatted)
    this.persistLog(LogLevel.ERROR, message, context)
  }

  fatal(message: string, context?: LogContext) {
    const formatted = this.formatMessage(LogLevel.FATAL, message, context)
    console.error(formatted)
    this.persistLog(LogLevel.FATAL, message, context)
  }

  // API performance logging
  async logApiCall(
    endpoint: string,
    method: string,
    statusCode: number,
    duration: number,
    error?: any
  ) {
    const context: LogContext = {
      endpoint,
      method,
      statusCode,
      duration,
      error: error ? error.message || error : undefined
    }

    if (statusCode >= 500) {
      this.error('API server error', context)
    } else if (statusCode >= 400) {
      this.warn('API client error', context)
    } else if (duration > 3000) {
      this.warn('Slow API response', context)
    } else {
      this.info('API call completed', context)
    }
  }

  // Lead activity logging
  async logLeadActivity(
    leadId: string,
    activity: string,
    metadata?: Record<string, any>
  ) {
    this.info(`Lead activity: ${activity}`, {
      leadId,
      metadata
    })
  }

  // Error tracking for monitoring
  async trackError(error: Error, context?: LogContext) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      ...context
    }

    this.error('Application error', errorData)

    // In production, send to error tracking service (e.g., Sentry)
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with Sentry or similar service
    }
  }
}

// Export singleton instance
export const logger = Logger.getInstance()