// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt'],

  // Runtime configuration for environment variables
  runtimeConfig: {
    // Private keys (server-side only, never exposed to client)
    // These values are accessible via useRuntimeConfig() in server-side code only
    openaiApiKey: process.env.OPENAI_API_KEY, // OpenAI API key for gpt-5 model

    // Public keys (exposed to client if needed)
    // These values are accessible via useRuntimeConfig() in both client and server
    public: {
      // Add public config here if needed (e.g., app name, version)
    }
  }
})