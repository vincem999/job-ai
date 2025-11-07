/**
 * Global error handler middleware for H3
 * This middleware catches unhandled errors in the application
 */

import { defineEventHandler } from 'h3'

export default defineEventHandler(async (_event) => {
  // This middleware doesn't need to do anything on its own
  // It's used as a fallback for unhandled errors in the app
  // The actual error handling logic is in the withErrorHandler utility
  return
})