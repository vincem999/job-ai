import * as Sentry from '@sentry/nuxt'
import { defineEventHandler } from 'h3'
import { handleError, createAppError } from '../utils/errorHandler'

export default defineEventHandler(async (event) => {
  try {
    // Simulate a server-side error
    throw new Error('Test server-side error for Sentry monitoring')
  } catch (error) {
    // Capture the error with Sentry
    Sentry.captureException(error)

    // Use standardized error handling
    const appError = createAppError.server(
      'Internal Server Error - Sentry Test',
      error instanceof Error ? error : undefined
    )

    return handleError(appError, event)
  }
})