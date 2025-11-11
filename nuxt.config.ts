// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Nuxt 4 modules
  modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt', '@sentry/nuxt/module'],

  // Global CSS
  css: ['~/assets/css/main.css'],

  // Runtime configuration for environment variables
  runtimeConfig: {
    // Private keys (server-side only, never exposed to client)
    // These values are accessible via useRuntimeConfig() in server-side code only
    openaiApiKey: process.env.OPENAI_API_KEY || '', // OpenAI API key for job analysis and document generation
    perplexityApiKey: process.env.PERPLEXITY_API_KEY || '', // Perplexity API key for research features

    // Future environment variables (currently unused but defined for Phase 2+)
    redisUrl: process.env.UPSTASH_REDIS_URL || '',
    redisToken: process.env.UPSTASH_REDIS_TOKEN || '',
    sentryDsn: process.env.SENTRY_DSN || '',

    // Public keys (exposed to client if needed)
    // These values are accessible via useRuntimeConfig() in both client and server
    public: {
      appName: 'CV Optimizer',
      appVersion: '1.0.0',
      appDescription: 'AI-powered CV and cover letter generator',
      sentryDsn: process.env.SENTRY_DSN || ''
    }
  },

  // Nitro server configuration for deployment
  nitro: {
    preset: 'vercel', // Optimized for Vercel deployment

    // Server route rules for API optimization
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    }
  },

  // Auto-import configuration
  imports: {
    dirs: [
      // Only scan specific directories and patterns
      'composables',
      'utils',
      'stores',
      // Scan server utils but exclude validation directory to prevent README import
      'server/utils/!(validation)',
      // Explicitly include validation index file only
      'server/utils/validation/index.{ts,js,mjs,mts}'
    ]
  },

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: false // Disabled to avoid vue-tsc timing issues in dev
  },

  // Sentry configuration
  sentry: {
    org: 'vincent-9k',
    project: 'javascript-nuxt',
    authToken: process.env.SENTRY_AUTH_TOKEN,
  },

  sourcemap: {
    client: 'hidden'
  }
})