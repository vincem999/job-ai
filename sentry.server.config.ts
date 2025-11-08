import * as Sentry from '@sentry/nuxt'

Sentry.init({
  // Replace with your actual DSN
  dsn: process.env.SENTRY_DSN,

  // Set environment to distinguish between dev/prod
  environment: process.env.NODE_ENV || 'development',

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Set sample rate for profiling
  // This is relative to tracesSampleRate
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Filter out sensitive data and noise
  beforeSend(event) {
    // Don't send events in development unless explicitly testing
    if (process.env.NODE_ENV === 'development' && !event.request?.url?.includes('test-error')) {
      return null
    }

    // Remove sensitive environment variables
    if (event.contexts?.runtime?.name === 'node' && event.extra) {
      delete event.extra.env
    }

    // Filter out sensitive headers
    if (event.request?.headers) {
      const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key']
      sensitiveHeaders.forEach(header => {
        if (event.request?.headers?.[header]) {
          event.request.headers[header] = '***'
        }
      })
    }

    // Remove sensitive data from URLs
    if (event.request?.url) {
      event.request.url = event.request.url.replace(/[?&](api_key|token|password)=[^&]*/gi, '&$1=***')
    }

    return event
  },

  // Enable debug mode in development
  debug: process.env.NODE_ENV === 'development',

  // Set initial scope for server context
  initialScope: {
    tags: {
      component: 'server'
    }
  }
})