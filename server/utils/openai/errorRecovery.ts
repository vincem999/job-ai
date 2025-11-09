import OpenAI from 'openai'

/**
 * Configuration options for the retry mechanism
 */
export interface RetryOptions {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number
  /** Initial delay in milliseconds (default: 1000) */
  initialDelay?: number
  /** Exponential backoff multiplier (default: 2) */
  exponentialBase?: number
  /** Maximum delay cap in milliseconds (default: 30000 - 30 seconds) */
  maxDelay?: number
  /** Add random jitter to prevent thundering herd (default: true) */
  jitter?: boolean
}

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000,
  exponentialBase: 2,
  maxDelay: 30000,
  jitter: true,
}

/**
 * State information passed to retry callbacks
 */
export interface RetryState {
  /** Current attempt number (1-based) */
  attempt: number
  /** Total elapsed time in milliseconds */
  elapsed: number
  /** The last error that occurred */
  error: Error
  /** Array of all errors encountered */
  errors: Error[]
}

/**
 * Determines if an error is retryable based on OpenAI error types
 *
 * @param error - The error to check
 * @returns true if the error should trigger a retry
 */
export function isRetryableError(error: unknown): boolean {
  // Network errors, timeouts, and connection errors are retryable
  if (error instanceof OpenAI.APIConnectionError ||
      error instanceof OpenAI.APIConnectionTimeoutError ||
      (error instanceof Error && error.message.includes('ECONNRESET'))) {
    return true
  }

  if (!(error instanceof OpenAI.APIError)) {
    return false
  }

  // Retryable OpenAI API errors
  const retryableStatuses = [
    429, // Rate limit
    500, // Internal server error
    502, // Bad gateway
    503, // Service unavailable
    504, // Gateway timeout
  ]

  return retryableStatuses.includes(error.status || 0) ||
         error instanceof OpenAI.RateLimitError ||
         error instanceof OpenAI.InternalServerError
}

/**
 * Calculates the delay before the next retry attempt using exponential backoff
 *
 * @param attempt - Current attempt number (1-based)
 * @param options - Retry configuration options
 * @returns Delay in milliseconds
 */
export function calculateBackoffDelay(attempt: number, options: Required<RetryOptions>): number {
  // Calculate exponential delay: initialDelay * (exponentialBase ^ (attempt - 1))
  const exponentialDelay = options.initialDelay * Math.pow(options.exponentialBase, attempt - 1)

  // Cap the delay at maxDelay
  let delay = Math.min(exponentialDelay, options.maxDelay)

  // Add jitter to prevent thundering herd problem
  if (options.jitter) {
    // Add up to 10% random jitter
    const jitterAmount = delay * 0.1
    delay += Math.random() * jitterAmount
  }

  return Math.floor(delay)
}

/**
 * Handles specific OpenAI error types and returns appropriate retry delay
 *
 * @param error - The OpenAI error
 * @param attempt - Current attempt number
 * @param options - Retry configuration
 * @returns Delay in milliseconds, or null if error is not retryable
 */
export function handleOpenAIError(
  error: InstanceType<typeof OpenAI.APIError>,
  attempt: number,
  options: Required<RetryOptions>
): number | null {
  // Handle rate limit errors with retry-after header
  if (error instanceof OpenAI.RateLimitError) {
    const retryAfterHeader = error.headers?.get?.('retry-after') || (error.headers as any)?.['retry-after']
    if (retryAfterHeader) {
      const retryAfterMs = Number(retryAfterHeader) * 1000
      // Use the longer of retry-after header or calculated backoff
      return Math.max(retryAfterMs, calculateBackoffDelay(attempt, options))
    }
  }

  // For other retryable errors, use standard exponential backoff
  if (isRetryableError(error)) {
    return calculateBackoffDelay(attempt, options)
  }

  // Error is not retryable
  return null
}

/**
 * Retries an async function with exponential backoff and comprehensive error handling
 *
 * @template T - The return type of the operation function
 * @param operation - The async function to retry
 * @param options - Retry configuration options
 * @returns Promise that resolves with the operation result or rejects with the final error
 *
 * @example
 * ```typescript
 * const result = await retryWithBackoff(
 *   async () => {
 *     const completion = await openai.chat.completions.create({
 *       model: 'gpt-4o',
 *       messages: [{ role: 'user', content: 'Hello!' }]
 *     })
 *     return completion
 *   },
 *   {
 *     maxRetries: 5,
 *     initialDelay: 500,
 *     exponentialBase: 2,
 *     maxDelay: 15000
 *   }
 * )
 * ```
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_RETRY_OPTIONS, ...options }
  const errors: Error[] = []
  const startTime = Date.now()

  for (let attempt = 1; attempt <= config.maxRetries + 1; attempt++) {
    try {
      // Attempt the operation
      const result = await operation()

      // Log successful retry if this wasn't the first attempt
      if (attempt > 1) {
        console.info(`Operation succeeded on attempt ${attempt} after ${Date.now() - startTime}ms`)
      }

      return result
    } catch (error) {
      const elapsed = Date.now() - startTime
      errors.push(error instanceof Error ? error : new Error(String(error)))

      // If this is the last attempt, throw the error
      if (attempt > config.maxRetries) {
        const finalError = error instanceof Error ? error : new Error(String(error))
        console.error(`All ${config.maxRetries} retry attempts failed after ${elapsed}ms`, {
          attempts: attempt - 1,
          errors: errors.map(e => e.message),
          finalError: finalError.message
        })
        throw finalError
      }

      // Determine if error is retryable and calculate delay
      let delayMs: number | null = null

      if (error instanceof OpenAI.APIError) {
        delayMs = handleOpenAIError(error, attempt, config)
      } else if (isRetryableError(error)) {
        delayMs = calculateBackoffDelay(attempt, config)
      }

      if (delayMs === null) {
        // Error is not retryable, throw immediately
        console.warn(`Non-retryable error encountered on attempt ${attempt}:`, error)
        throw error
      }

      // Log retry information
      console.warn(`Attempt ${attempt} failed, retrying in ${delayMs}ms:`, {
        error: error instanceof Error ? error.message : String(error),
        elapsed,
        nextDelay: delayMs
      })

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
  }

  // This should never be reached due to the loop logic above
  throw new Error('Unexpected end of retry loop')
}

/**
 * Creates a wrapper function that automatically applies retry logic to any async function
 *
 * @template Args - The argument types of the function
 * @template Return - The return type of the function
 * @param fn - The async function to wrap
 * @param options - Retry configuration options
 * @returns A wrapped function that includes retry logic
 *
 * @example
 * ```typescript
 * const resilientApiCall = withRetry(
 *   async (prompt: string) => {
 *     return await openai.chat.completions.create({
 *       model: 'gpt-4o',
 *       messages: [{ role: 'user', content: prompt }]
 *     })
 *   },
 *   { maxRetries: 3, initialDelay: 1000 }
 * )
 *
 * const result = await resilientApiCall('Hello, world!')
 * ```
 */
export function withRetry<Args extends any[], Return>(
  fn: (...args: Args) => Promise<Return>,
  options: RetryOptions = {}
): (...args: Args) => Promise<Return> {
  return (...args: Args) => retryWithBackoff(() => fn(...args), options)
}