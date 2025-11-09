import OpenAI from 'openai'
import { retryWithBackoff } from './errorRecovery'

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
        'OPENAI_API_KEY is not configured in environment variables. ' +
        'Please set OPENAI_API_KEY in your .env file or environment.'
      )
    }

    // Initialize the OpenAI client with optimal configuration
    openaiClient = new OpenAI({
      apiKey: config.openaiApiKey,
      maxRetries: 3,              // Retry failed requests up to 3 times
      timeout: 30 * 1000,         // 30 second timeout per request
      // Note: No default headers needed for basic usage
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

/**
 * Creates a chat completion with automatic retry logic for handling transient failures.
 *
 * This function wraps the OpenAI chat.completions.create method with comprehensive
 * retry logic that handles rate limits, server errors, and network failures gracefully.
 *
 * Features:
 * - Exponential backoff with jitter to prevent thundering herd
 * - Respects rate limit retry-after headers
 * - Configurable retry attempts and timing
 * - Detailed logging for debugging and monitoring
 * - Type-safe parameters and responses
 *
 * @param params - OpenAI chat completion parameters
 * @param retryOptions - Optional retry configuration
 * @returns Promise resolving to the chat completion response
 *
 * @example
 * ```typescript
 * const completion = await createChatCompletionWithRetry({
 *   model: 'gpt-4o-mini',
 *   messages: [{ role: 'user', content: 'Hello!' }],
 *   temperature: 0.7,
 *   max_tokens: 1000
 * }, {
 *   maxRetries: 5,
 *   initialDelay: 1000
 * })
 * ```
 */
export async function createChatCompletionWithRetry(
  params: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming,
  retryOptions: {
    /** Maximum number of retry attempts (default: 3) */
    maxRetries?: number
    /** Initial delay in milliseconds (default: 1000) */
    initialDelay?: number
    /** Maximum delay cap in milliseconds (default: 30000) */
    maxDelay?: number
    /** Enable jitter to prevent thundering herd (default: true) */
    jitter?: boolean
  } = {}
): Promise<OpenAI.Chat.Completions.ChatCompletion> {
  const client = getOpenAIClient()

  return retryWithBackoff(
    async () => {
      console.log(`🤖 OpenAI: Creating chat completion with model ${params.model}...`)
      const completion = await client.chat.completions.create(params) as OpenAI.Chat.Completions.ChatCompletion
      console.log(`✅ OpenAI: Chat completion successful (${completion.usage?.total_tokens || 'unknown'} tokens)`)
      return completion
    },
    {
      maxRetries: 3,
      initialDelay: 1000,
      exponentialBase: 2,
      maxDelay: 30000,
      jitter: true,
      ...retryOptions
    }
  )
}