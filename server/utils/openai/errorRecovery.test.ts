import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import OpenAI from 'openai'
import {
  retryWithBackoff,
  withRetry,
  isRetryableError,
  calculateBackoffDelay,
  handleOpenAIError,
  type RetryOptions
} from './errorRecovery'

// Mock console to avoid noise in tests
beforeEach(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'info').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('isRetryableError', () => {
  it('should identify retryable OpenAI API errors by status', () => {
    // Mock errors with the expected structure
    const headers = new Headers()

    const rateLimitError = {
      ...new Error('Rate limit exceeded'),
      status: 429,
      headers,
      error: { message: 'Rate limit exceeded', type: 'rate_limit_exceeded' },
      requestID: 'test-id',
      code: null,
      param: null,
      type: 'rate_limit_exceeded'
    }
    Object.setPrototypeOf(rateLimitError, OpenAI.RateLimitError.prototype)

    const internalServerError = {
      ...new Error('Internal server error'),
      status: 500,
      headers,
      error: { message: 'Internal server error', type: 'internal_server_error' },
      requestID: 'test-id',
      code: null,
      param: null,
      type: 'internal_server_error'
    }
    Object.setPrototypeOf(internalServerError, OpenAI.InternalServerError.prototype)

    const serviceUnavailableError = {
      ...new Error('Service unavailable'),
      status: 503,
      headers,
      error: { message: 'Service unavailable', type: 'service_unavailable' },
      requestID: 'test-id',
      code: null,
      param: null,
      type: 'service_unavailable'
    }
    Object.setPrototypeOf(serviceUnavailableError, OpenAI.APIError.prototype)

    expect(isRetryableError(rateLimitError)).toBe(true)
    expect(isRetryableError(internalServerError)).toBe(true)
    expect(isRetryableError(serviceUnavailableError)).toBe(true)
  })

  it('should identify non-retryable OpenAI API errors', () => {
    const headers = new Headers()

    const authError = {
      ...new Error('Invalid API key'),
      status: 401,
      headers,
      error: { message: 'Invalid API key', type: 'authentication_error' },
      requestID: 'test-id',
      code: null,
      param: null,
      type: 'authentication_error'
    }
    Object.setPrototypeOf(authError, OpenAI.AuthenticationError.prototype)

    const badRequestError = {
      ...new Error('Bad request'),
      status: 400,
      headers,
      error: { message: 'Bad request', type: 'bad_request' },
      requestID: 'test-id',
      code: null,
      param: null,
      type: 'bad_request'
    }
    Object.setPrototypeOf(badRequestError, OpenAI.BadRequestError.prototype)

    expect(isRetryableError(authError)).toBe(false)
    expect(isRetryableError(badRequestError)).toBe(false)
  })

  it('should identify retryable connection errors', () => {
    const connectionError = new Error('Connection failed')
    Object.setPrototypeOf(connectionError, OpenAI.APIConnectionError.prototype)

    const timeoutError = new Error('Request timeout')
    Object.setPrototypeOf(timeoutError, OpenAI.APIConnectionTimeoutError.prototype)

    const networkError = new Error('ECONNRESET')

    expect(isRetryableError(connectionError)).toBe(true)
    expect(isRetryableError(timeoutError)).toBe(true)
    expect(isRetryableError(networkError)).toBe(true)
  })
})

describe('calculateBackoffDelay', () => {
  const options = {
    maxRetries: 3,
    initialDelay: 1000,
    exponentialBase: 2,
    maxDelay: 30000,
    jitter: false,
  }

  it('should calculate exponential backoff correctly', () => {
    expect(calculateBackoffDelay(1, options)).toBe(1000) // 1000 * 2^0
    expect(calculateBackoffDelay(2, options)).toBe(2000) // 1000 * 2^1
    expect(calculateBackoffDelay(3, options)).toBe(4000) // 1000 * 2^2
    expect(calculateBackoffDelay(4, options)).toBe(8000) // 1000 * 2^3
  })

  it('should respect maximum delay cap', () => {
    const cappedOptions = { ...options, maxDelay: 5000 }
    expect(calculateBackoffDelay(4, cappedOptions)).toBe(5000) // Should be capped at 5000
  })

  it('should add jitter when enabled', () => {
    const jitteredOptions = { ...options, jitter: true }
    const delay1 = calculateBackoffDelay(2, jitteredOptions)
    const delay2 = calculateBackoffDelay(2, jitteredOptions)

    // Should be around 2000ms but with jitter
    expect(delay1).toBeGreaterThanOrEqual(2000)
    expect(delay1).toBeLessThanOrEqual(2200) // 2000 + 10% jitter
    expect(delay2).toBeGreaterThanOrEqual(2000)
    expect(delay2).toBeLessThanOrEqual(2200)
  })
})

describe('handleOpenAIError', () => {
  const options = {
    maxRetries: 3,
    initialDelay: 1000,
    exponentialBase: 2,
    maxDelay: 30000,
    jitter: false,
  }

  it('should handle rate limit errors with retry-after header', () => {
    const headers = new Headers()
    headers.set('retry-after', '60')

    const rateLimitError = {
      ...new Error('Rate limit exceeded'),
      status: 429,
      headers,
      error: { message: 'Rate limit exceeded', type: 'rate_limit_exceeded' },
      requestID: 'test-request-id',
      code: null,
      param: null,
      type: 'rate_limit_exceeded'
    }
    Object.setPrototypeOf(rateLimitError, OpenAI.RateLimitError.prototype)

    const delay = handleOpenAIError(rateLimitError, 1, options)
    expect(delay).toBe(60000) // Should use retry-after header (60 seconds)
  })

  it('should handle rate limit errors without retry-after header', () => {
    const headers = new Headers()

    const rateLimitError = {
      ...new Error('Rate limit exceeded'),
      status: 429,
      headers,
      error: { message: 'Rate limit exceeded', type: 'rate_limit_exceeded' },
      requestID: 'test-request-id',
      code: null,
      param: null,
      type: 'rate_limit_exceeded'
    }
    Object.setPrototypeOf(rateLimitError, OpenAI.RateLimitError.prototype)

    const delay = handleOpenAIError(rateLimitError, 1, options)
    expect(delay).toBe(1000) // Should fall back to standard backoff
  })

  it('should handle retryable server errors', () => {
    const headers = new Headers()

    const serverError = {
      ...new Error('Internal server error'),
      status: 500,
      headers,
      error: { message: 'Internal server error', type: 'internal_server_error' },
      requestID: 'test-request-id',
      code: null,
      param: null,
      type: 'internal_server_error'
    }
    Object.setPrototypeOf(serverError, OpenAI.InternalServerError.prototype)

    const delay = handleOpenAIError(serverError, 2, options)
    expect(delay).toBe(2000) // Standard exponential backoff
  })

  it('should reject non-retryable errors', () => {
    const headers = new Headers()

    const authError = {
      ...new Error('Invalid API key'),
      status: 401,
      headers,
      error: { message: 'Invalid API key', type: 'authentication_error' },
      requestID: 'test-request-id',
      code: null,
      param: null,
      type: 'authentication_error'
    }
    Object.setPrototypeOf(authError, OpenAI.AuthenticationError.prototype)

    const delay = handleOpenAIError(authError, 1, options)
    expect(delay).toBeNull()
  })
})

describe('retryWithBackoff', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should succeed on first attempt', async () => {
    const operation = vi.fn().mockResolvedValue('success')

    const result = await retryWithBackoff(operation, { maxRetries: 3 })

    expect(result).toBe('success')
    expect(operation).toHaveBeenCalledTimes(1)
  })

  it('should retry on retryable errors', async () => {
    const headers = new Headers()

    const rateLimitError = {
      ...new Error('Rate limit'),
      status: 429,
      headers,
      error: { message: 'Rate limit', type: 'rate_limit_exceeded' },
      requestID: 'test-id',
      code: null,
      param: null,
      type: 'rate_limit_exceeded'
    }
    Object.setPrototypeOf(rateLimitError, OpenAI.RateLimitError.prototype)

    const serverError = {
      ...new Error('Server error'),
      status: 500,
      headers,
      error: { message: 'Server error', type: 'internal_server_error' },
      requestID: 'test-id',
      code: null,
      param: null,
      type: 'internal_server_error'
    }
    Object.setPrototypeOf(serverError, OpenAI.InternalServerError.prototype)

    const operation = vi.fn()
      .mockRejectedValueOnce(rateLimitError)
      .mockRejectedValueOnce(serverError)
      .mockResolvedValue('success')

    const options: RetryOptions = { maxRetries: 3, initialDelay: 100, jitter: false }

    // Start the retry operation
    const resultPromise = retryWithBackoff(operation, options)

    // Fast-forward through the delays
    await vi.advanceTimersByTimeAsync(100) // First retry delay
    await vi.advanceTimersByTimeAsync(200) // Second retry delay

    const result = await resultPromise

    expect(result).toBe('success')
    expect(operation).toHaveBeenCalledTimes(3)
  })

  it('should fail immediately on non-retryable errors', async () => {
    const headers = new Headers()

    const authError = {
      ...new Error('Invalid API key'),
      status: 401,
      headers,
      error: { message: 'Invalid API key', type: 'authentication_error' },
      requestID: 'test-id',
      code: null,
      param: null,
      type: 'authentication_error'
    }
    Object.setPrototypeOf(authError, OpenAI.AuthenticationError.prototype)

    const operation = vi.fn().mockRejectedValue(authError)

    await expect(retryWithBackoff(operation, { maxRetries: 3 })).rejects.toThrow(authError)
    expect(operation).toHaveBeenCalledTimes(1)
  })

  it('should exhaust retries and throw final error', async () => {
    const headers = new Headers()

    const persistentError = {
      ...new Error('Rate limit'),
      status: 429,
      headers,
      error: { message: 'Rate limit', type: 'rate_limit_exceeded' },
      requestID: 'test-id',
      code: null,
      param: null,
      type: 'rate_limit_exceeded'
    }
    Object.setPrototypeOf(persistentError, OpenAI.RateLimitError.prototype)

    const operation = vi.fn().mockRejectedValue(persistentError)

    const options: RetryOptions = { maxRetries: 2, initialDelay: 100, jitter: false }

    // Start the retry operation
    const resultPromise = retryWithBackoff(operation, options)

    // Fast-forward through all delays
    await vi.advanceTimersByTimeAsync(100) // First retry delay
    await vi.advanceTimersByTimeAsync(200) // Second retry delay

    await expect(resultPromise).rejects.toThrow(persistentError)
    expect(operation).toHaveBeenCalledTimes(3) // Initial + 2 retries
  })

  it('should handle rate limit with retry-after header', async () => {
    const headers = new Headers()
    headers.set('retry-after', '5')

    const rateLimitError = {
      ...new Error('Rate limit exceeded'),
      status: 429,
      headers,
      error: { message: 'Rate limit exceeded', type: 'rate_limit_exceeded' },
      requestID: 'test-id',
      code: null,
      param: null,
      type: 'rate_limit_exceeded'
    }
    Object.setPrototypeOf(rateLimitError, OpenAI.RateLimitError.prototype)

    const operation = vi.fn()
      .mockRejectedValueOnce(rateLimitError)
      .mockResolvedValue('success')

    const options: RetryOptions = { maxRetries: 2, initialDelay: 1000, jitter: false }

    const resultPromise = retryWithBackoff(operation, options)

    // Should wait 5 seconds (from retry-after header)
    await vi.advanceTimersByTimeAsync(5000)

    const result = await resultPromise

    expect(result).toBe('success')
    expect(operation).toHaveBeenCalledTimes(2)
  })
})

describe('withRetry', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should create a wrapped function with retry logic', async () => {
    const headers = new Headers()

    const rateLimitError = {
      ...new Error('Rate limit'),
      status: 429,
      headers,
      error: { message: 'Rate limit', type: 'rate_limit_exceeded' },
      requestID: 'test-id',
      code: null,
      param: null,
      type: 'rate_limit_exceeded'
    }
    Object.setPrototypeOf(rateLimitError, OpenAI.RateLimitError.prototype)

    const originalFn = vi.fn()
      .mockRejectedValueOnce(rateLimitError)
      .mockResolvedValue('success')

    const wrappedFn = withRetry(originalFn, { maxRetries: 2, initialDelay: 100, jitter: false })

    const resultPromise = wrappedFn('test-arg')

    await vi.advanceTimersByTimeAsync(100)

    const result = await resultPromise

    expect(result).toBe('success')
    expect(originalFn).toHaveBeenCalledTimes(2)
    expect(originalFn).toHaveBeenCalledWith('test-arg')
  })

  it('should preserve function arguments', async () => {
    const originalFn = vi.fn().mockResolvedValue('success')
    const wrappedFn = withRetry(originalFn)

    await wrappedFn('arg1', 'arg2', 123)

    expect(originalFn).toHaveBeenCalledWith('arg1', 'arg2', 123)
  })
})