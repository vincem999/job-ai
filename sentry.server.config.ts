import * as Sentry from "@sentry/nuxt";

// Only run `init` when process.env.SENTRY_DSN is available.
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // Set environment to distinguish between dev/prod
    environment: process.env.NODE_ENV || 'development',

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Enable logs to be sent to Sentry
    enableLogs: true,

    // Enable sending of user PII (Personally Identifiable Information)
    // https://docs.sentry.io/platforms/javascript/guides/nuxt/configuration/options/#sendDefaultPii
    sendDefaultPii: false, // Changed to false for better privacy

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: process.env.NODE_ENV === 'development',

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

    // Set initial scope for server context
    initialScope: {
      tags: {
        component: 'server'
      }
    }
  });
}
