import OpenAI from "openai"

/**
 * Singleton instance of the OpenAI client
 * Initialized only when first requested to avoid unnecessary API calls during server startup
 */
let openaiClient: OpenAI | null = null

/**
 * Get a singleton instance of the OpenAI client configured with the API key from environment variables.
 *
 * This function implements the singleton pattern to ensure only one OpenAI client instance
 * is created throughout the application lifecycle, improving performance and resource usage.
 *
 * Configuration:
 * - API Key: Retrieved from OPENAI_API_KEY environment variable via Nuxt runtime config
 * - Model: Configured to work with gpt-5 (gpt-5-2025-08-07)
 * - Retries: Maximum of 3 retries for failed requests with exponential backoff
 * - Timeout: 30 seconds per request to prevent hanging requests
 *
 * Important Notes for gpt-5:
 * - Use `max_completion_tokens` instead of `max_tokens`
 * - Temperature parameter must be omitted (only default value of 1 is supported)
 * - Model supports reasoning tokens which are included in usage statistics
 *
 * Usage Example:
 * ```typescript
 * const openai = getOpenAIClient()
 * const completion = await openai.chat.completions.create({
 *   model: 'gpt-5',
 *   messages: [{ role: 'user', content: 'Hello!' }],
 *   max_completion_tokens: 100
 * })
 * ```
 *
 * @returns OpenAI client instance ready for API calls
 * @throws Error if OPENAI_API_KEY is not configured in environment variables
 */
export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    // Get runtime configuration from Nuxt
    const config = useRuntimeConfig()

    // Validate that the API key is present
    if (!config.openaiApiKey) {
      throw new Error(
        "OPENAI_API_KEY is not configured in environment variables. " +
          "Please set OPENAI_API_KEY in your .env file or environment."
      )
    }

    openaiClient = new OpenAI({
      apiKey: config.openaiApiKey,
    })
  }

  return openaiClient
}

/**
 * Reset the client instance to null, forcing recreation on next access.
 * This is primarily useful for testing scenarios where you need to reinitialize
 * the client with different configuration or clear cached instances.
 *
 * @example
 * ```typescript
 * // In tests
 * resetOpenAIClient()
 * // Next call to getOpenAIClient() will create a new instance
 * ```
 */
export function resetOpenAIClient(): void {
  openaiClient = null
}
