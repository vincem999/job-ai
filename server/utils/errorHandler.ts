/**
 * Centralized error handler middleware for consistent API error formatting
 */

import { setResponseStatus } from 'h3'
import type { H3Event } from 'h3'
import {
  type AppError,
  type ErrorResponse,
  type ErrorHandler,
  type ErrorHandlerOptions,
  type ErrorFactory,
  ErrorCode,
  ErrorSeverity
} from '../types/errors'

/**
 * Default error handler options
 */
const DEFAULT_OPTIONS: Required<ErrorHandlerOptions> = {
  includeStack: process.env.NODE_ENV === 'development',
  includeContext: process.env.NODE_ENV === 'development',
  logger: defaultLogger,
  requestIdGenerator: generateRequestId
}

/**
 * Default logger function
 */
const defaultLogger = (error: AppError, event: H3Event): void => {
  const method = event.node.req.method
  const url = event.node.req.url
  const userAgent = event.node.req.headers['user-agent']

  console.error(`[Error Handler] ${error.severity.toUpperCase()}:`, {
    code: error.code,
    message: error.message,
    statusCode: error.statusCode,
    method,
    url,
    userAgent,
    requestId: error.requestId,
    timestamp: error.timestamp,
    context: error.context,
    cause: error.cause?.message
  })
}

/**
 * Generate a simple request ID
 */
const generateRequestId = (_event: H3Event): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Convert unknown error to standardized AppError
 */
const normalizeError = (error: unknown): AppError => {
  // Already an AppError
  if (isAppError(error)) {
    return error
  }

  // H3 createError
  if (error && typeof error === 'object' && 'statusCode' in error && 'message' in error) {
    const h3Error = error as { statusCode: number; message: string; statusMessage?: string }
    return {
      code: getErrorCodeFromStatus(h3Error.statusCode),
      message: h3Error.statusMessage || h3Error.message || 'An error occurred',
      statusCode: h3Error.statusCode,
      severity: getSeverityFromStatus(h3Error.statusCode),
      timestamp: new Date().toISOString()
    }
  }

  // Standard Error
  if (error instanceof Error) {
    return {
      code: ErrorCode.UNKNOWN_ERROR,
      message: error.message || 'An unknown error occurred',
      statusCode: 500,
      severity: ErrorSeverity.HIGH,
      cause: error,
      timestamp: new Date().toISOString()
    }
  }

  // String error
  if (typeof error === 'string') {
    return {
      code: ErrorCode.UNKNOWN_ERROR,
      message: error,
      statusCode: 500,
      severity: ErrorSeverity.MEDIUM,
      timestamp: new Date().toISOString()
    }
  }

  // Unknown error type
  return {
    code: ErrorCode.UNKNOWN_ERROR,
    message: 'An unknown error occurred',
    statusCode: 500,
    severity: ErrorSeverity.HIGH,
    timestamp: new Date().toISOString(),
    context: { originalError: error }
  }
}

/**
 * Check if error is already an AppError
 */
const isAppError = (error: unknown): error is AppError => {
  return (
    error !== null &&
    typeof error === 'object' &&
    'code' in error &&
    'message' in error &&
    'statusCode' in error &&
    'severity' in error
  )
}

/**
 * Map HTTP status code to error code
 */
const getErrorCodeFromStatus = (statusCode: number): ErrorCode => {
  switch (statusCode) {
    case 400:
      return ErrorCode.INVALID_INPUT
    case 401:
      return ErrorCode.UNAUTHORIZED
    case 403:
      return ErrorCode.FORBIDDEN
    case 404:
      return ErrorCode.NOT_FOUND
    case 413:
      return ErrorCode.PAYLOAD_TOO_LARGE
    case 422:
      return ErrorCode.VALIDATION_ERROR
    case 429:
      return ErrorCode.RATE_LIMITED
    case 500:
    default:
      return ErrorCode.PROCESSING_ERROR
  }
}

/**
 * Map HTTP status code to error severity
 */
const getSeverityFromStatus = (statusCode: number): ErrorSeverity => {
  if (statusCode >= 500) return ErrorSeverity.HIGH
  if (statusCode >= 400) return ErrorSeverity.MEDIUM
  return ErrorSeverity.LOW
}

/**
 * Main error handler function
 */
export const handleError: ErrorHandler = (
  error: unknown,
  event: H3Event,
  options?: ErrorHandlerOptions
): ErrorResponse => {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const normalizedError = normalizeError(error)

  // Add request ID if not present
  if (!normalizedError.requestId) {
    normalizedError.requestId = opts.requestIdGenerator(event)
  }

  // Set HTTP status
  setResponseStatus(event, normalizedError.statusCode)

  // Log the error
  opts.logger(normalizedError, event)

  // Build response
  const response: ErrorResponse = {
    success: false,
    code: normalizedError.code,
    error: normalizedError.message,
    timestamp: normalizedError.timestamp || new Date().toISOString(),
    requestId: normalizedError.requestId
  }

  // Add debug details in development
  if (opts.includeStack || opts.includeContext) {
    response.details = {}

    if (opts.includeStack && normalizedError.cause?.stack) {
      response.details.stack = normalizedError.cause.stack
    }

    if (opts.includeContext && normalizedError.context) {
      response.details.context = normalizedError.context
    }

    if (normalizedError.cause?.message) {
      response.details.cause = normalizedError.cause.message
    }
  }

  return response
}

/**
 * Error factory for creating common errors
 */
export const createAppError: ErrorFactory = {
  validation: (message: string, context?: Record<string, unknown>): AppError => ({
    code: ErrorCode.VALIDATION_ERROR,
    message,
    statusCode: 422,
    severity: ErrorSeverity.MEDIUM,
    context,
    timestamp: new Date().toISOString()
  }),

  notFound: (resource = 'Resource'): AppError => ({
    code: ErrorCode.NOT_FOUND,
    message: `${resource} not found`,
    statusCode: 404,
    severity: ErrorSeverity.LOW,
    timestamp: new Date().toISOString()
  }),

  unauthorized: (message = 'Unauthorized access'): AppError => ({
    code: ErrorCode.UNAUTHORIZED,
    message,
    statusCode: 401,
    severity: ErrorSeverity.MEDIUM,
    timestamp: new Date().toISOString()
  }),

  rateLimit: (retryAfter?: number): AppError => ({
    code: ErrorCode.RATE_LIMITED,
    message: 'Too many requests, please try again later',
    statusCode: 429,
    severity: ErrorSeverity.MEDIUM,
    context: retryAfter ? { retryAfter } : undefined,
    timestamp: new Date().toISOString()
  }),

  server: (message: string, cause?: Error): AppError => ({
    code: ErrorCode.PROCESSING_ERROR,
    message,
    statusCode: 500,
    severity: ErrorSeverity.HIGH,
    cause,
    timestamp: new Date().toISOString()
  }),

  external: (service: string, cause?: Error): AppError => ({
    code: ErrorCode.EXTERNAL_SERVICE_ERROR,
    message: `External service error: ${service}`,
    statusCode: 502,
    severity: ErrorSeverity.HIGH,
    cause,
    context: { service },
    timestamp: new Date().toISOString()
  })
}

/**
 * Middleware that wraps API handlers with error handling
 * This is NOT a global middleware but a utility for wrapping handlers
 */
export function withErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<R> | R,
  options?: ErrorHandlerOptions
) {
  return async (...args: T) => {
    try {
      return await handler(...args)
    } catch (error) {
      // Assume first argument is the event
      const event = args[0] as H3Event
      throw handleError(error, event, options)
    }
  }
}

// Export types and utilities
export type { AppError, ErrorResponse, ErrorHandler, ErrorHandlerOptions, ErrorFactory }
export { ErrorCode, ErrorSeverity }