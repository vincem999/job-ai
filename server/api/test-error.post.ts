import * as Sentry from '@sentry/nuxt'

export default defineEventHandler(async () => {
  try {
    // Simulate a server-side error
    throw new Error('Test server-side error for Sentry monitoring')
  } catch (error) {
    // Capture the error with Sentry
    Sentry.captureException(error)

    // Re-throw to send proper error response
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error - Sentry Test'
    })
  }
})