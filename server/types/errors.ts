/**
 * Error handler types and interfaces for centralized error management
 */

import type { H3Event } from 'h3'

/**
 * Standard error codes used throughout the application
 */
export enum ErrorCode {
  // Client errors (4xx)
  INVALID_INPUT = 'INVALID_INPUT',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_URL = 'INVALID_URL',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMITED = 'RATE_LIMITED',
  PAYLOAD_TOO_LARGE = 'PAYLOAD_TOO_LARGE',

  // Server errors (5xx)
  PROCESSING_ERROR = 'PROCESSING_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Error severity levels for logging and monitoring
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Base error interface that all application errors should implement
 */
export interface AppError {
  /** Error code for programmatic handling */
  code: ErrorCode
  /** Human-readable error message */
  message: string
  /** HTTP status code */
  statusCode: number
  /** Error severity level */
  severity: ErrorSeverity
  /** Additional context data */
  context?: Record<string, unknown>
  /** Original error if this is a wrapped error */
  cause?: Error
  /** Timestamp when error occurred */
  timestamp?: string
  /** Request ID for tracking */
  requestId?: string
}

/**
 * Standard API error response format
 */
export interface ErrorResponse {
  /** Always false for error responses */
  success: false
  /** Error code */
  code: ErrorCode
  /** Error message */
  error: string
  /** Additional error details (only in development) */
  details?: {
    stack?: string
    cause?: string
    context?: Record<string, unknown>
  }
  /** Request timestamp */
  timestamp: string
  /** Request ID for tracking */
  requestId?: string
}

/**
 * Error handler configuration options
 */
export interface ErrorHandlerOptions {
  /** Whether to include error stack traces in response (default: false) */
  includeStack?: boolean
  /** Whether to include detailed error context (default: false in production) */
  includeContext?: boolean
  /** Custom error logging function */
  logger?: (error: AppError, event: H3Event) => void
  /** Custom request ID generator */
  requestIdGenerator?: (event: H3Event) => string
}

/**
 * Error handler function interface
 */
export interface ErrorHandler {
  /**
   * Handle and format an error for API response
   * @param error - The error to handle
   * @param event - The H3 event context
   * @param options - Handler options
   * @returns Formatted error response
   */
  (error: unknown, event: H3Event, options?: ErrorHandlerOptions): ErrorResponse
}

/**
 * Predefined error factory functions
 */
export interface ErrorFactory {
  /** Create a validation error */
  validation: (message: string, context?: Record<string, unknown>) => AppError
  /** Create a not found error */
  notFound: (resource?: string) => AppError
  /** Create an unauthorized error */
  unauthorized: (message?: string) => AppError
  /** Create a rate limit error */
  rateLimit: (retryAfter?: number) => AppError
  /** Create a server error */
  server: (message: string, cause?: Error) => AppError
  /** Create an external service error */
  external: (service: string, cause?: Error) => AppError
}