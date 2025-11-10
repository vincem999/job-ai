import type { z } from 'zod'
import type {
  JobAnalysisResponse,
  CVData,
} from '../validation/schemas'
import {
  JobAnalysisResponseSchema,
  CVSchema,
} from '../validation/schemas'

/**
 * Error types that can occur during parsing
 */
export class ParseError extends Error {
  constructor(
    message: string,
    public override readonly cause?: unknown,
    public readonly context?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'ParseError'
  }
}

export class JSONExtractionError extends ParseError {
  constructor(message: string, cause?: unknown) {
    super(message, cause)
    this.name = 'JSONExtractionError'
  }
}

export class ValidationError extends ParseError {
  constructor(message: string, public readonly zodError: z.ZodError) {
    super(message, zodError)
    this.name = 'ValidationError'
  }
}

/**
 * Configuration for parsing operations
 */
interface ParseConfig {
  /** Whether to attempt repair of common JSON formatting issues */
  attemptRepair?: boolean
  /** Whether to extract JSON from markdown code blocks */
  extractFromMarkdown?: boolean
  /** Maximum length of content to process */
  maxLength?: number
  /** Whether to log parsing attempts for debugging */
  debug?: boolean
}

/**
 * Result of parsing operation
 */
interface ParseResult<T> {
  success: boolean
  data?: T
  error?: ParseError
  repairAttempts?: string[]
  extractedJson?: string
}

/**
 * Parse and validate OpenAI API responses that should contain JSON data.
 *
 * This function handles common issues with LLM-generated JSON:
 * - Extracts JSON from markdown code blocks (```json ... ```)
 * - Attempts to repair malformed JSON with common fixes
 * - Validates the parsed data against provided Zod schemas
 * - Provides detailed error information for debugging
 *
 * Note: The function name is `parseClaudeJSON` for historical compatibility,
 * but it works with any JSON response, including those from OpenAI/GPT models.
 *
 * @param response - The raw response content from the API
 * @param schema - Zod schema to validate the parsed data against
 * @param config - Optional configuration for parsing behavior
 * @returns Promise resolving to a ParseResult with success/error information
 *
 * @example
 * ```typescript
 * // Parse a job analysis response
 * const result = await parseClaudeJSON(
 *   apiResponse.choices[0].message.content,
 *   JobAnalysisResponseSchema
 * )
 *
 * if (result.success) {
 *   console.log('Parsed data:', result.data)
 * } else {
 *   console.error('Parse error:', result.error?.message)
 * }
 * ```
 */
export async function parseClaudeJSON<T>(
  response: string,
  schema: z.ZodSchema<T>,
  config: ParseConfig = {}
): Promise<ParseResult<T>> {
  const {
    attemptRepair = true,
    extractFromMarkdown = true,
    maxLength = 100000
  } = config

  // Input validation
  if (!response || typeof response !== 'string') {
    return {
      success: false,
      error: new ParseError('Response is empty or not a string')
    }
  }

  if (response.length > maxLength) {
    return {
      success: false,
      error: new ParseError(`Response too long: ${response.length} > ${maxLength} characters`)
    }
  }

  const repairAttempts: string[] = []
  let extractedJson = response.trim()

  try {
    // Step 1: Extract JSON from markdown code blocks if present
    if (extractFromMarkdown) {
      const markdownMatch = extractedJson.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
      if (markdownMatch && markdownMatch[1]) {
        extractedJson = markdownMatch[1].trim()
        repairAttempts.push('Extracted from markdown code block')
      }
    }

    // Step 2: Find JSON object boundaries if there's extra text
    const jsonMatch = extractedJson.match(/\{[\s\S]*\}/)
    if (jsonMatch && jsonMatch[0] !== extractedJson) {
      extractedJson = jsonMatch[0]
      repairAttempts.push('Extracted JSON object from mixed content')
    }

    // Step 3: Attempt to parse JSON directly first
    let parsedData: unknown
    try {
      parsedData = JSON.parse(extractedJson)
    } catch (jsonError) {
      if (!attemptRepair) {
        return {
          success: false,
          error: new JSONExtractionError(
            'Failed to parse JSON and repair is disabled',
            jsonError
          ),
          extractedJson
        }
      }

      // Step 4: Attempt common JSON repairs
      const repairedJson = repairCommonJSONIssues(extractedJson)
      repairAttempts.push(...repairedJson.attempts)

      try {
        parsedData = JSON.parse(repairedJson.content)
        repairAttempts.push('Successfully repaired JSON')
      } catch (repairError) {
        return {
          success: false,
          error: new JSONExtractionError(
            'Failed to parse JSON even after repair attempts',
            repairError
          ),
          repairAttempts,
          extractedJson
        }
      }
    }

    // Step 5: Validate against schema
    const validationResult = schema.safeParse(parsedData)
    if (!validationResult.success) {
      return {
        success: false,
        error: new ValidationError(
          'Parsed JSON does not match expected schema',
          validationResult.error
        ),
        repairAttempts,
        extractedJson
      }
    }

    // Success!
    return {
      success: true,
      data: validationResult.data,
      repairAttempts: repairAttempts.length > 0 ? repairAttempts : undefined,
      extractedJson
    }

  } catch (error) {
    return {
      success: false,
      error: new ParseError(
        'Unexpected error during parsing',
        error,
        { originalResponse: response.slice(0, 500) }
      ),
      repairAttempts,
      extractedJson
    }
  }
}

/**
 * Attempt to repair common JSON formatting issues found in LLM responses
 *
 * @param jsonStr - The malformed JSON string
 * @returns Object containing repaired content and list of repair attempts
 */
const repairCommonJSONIssues = (jsonStr: string): {
  content: string
  attempts: string[]
} => {
  let content = jsonStr.trim()
  const attempts: string[] = []

  // Remove common prefixes that LLMs sometimes add
  const prefixPatterns = [
    { pattern: /^Here's the JSON response:\s*/i, description: 'Removed "Here\'s the JSON response" prefix' },
    { pattern: /^The JSON output is:\s*/i, description: 'Removed "The JSON output is" prefix' },
    { pattern: /^```json\s*/, description: 'Removed ```json prefix' },
    { pattern: /^```\s*/, description: 'Removed ``` prefix' },
    { pattern: /^JSON:\s*/i, description: 'Removed "JSON:" prefix' },
    { pattern: /^Response:\s*/i, description: 'Removed "Response:" prefix' }
  ]

  for (const { pattern, description } of prefixPatterns) {
    const newContent = content.replace(pattern, '')
    if (newContent !== content) {
      content = newContent
      attempts.push(description)
    }
  }

  // Remove common suffixes
  const suffixPatterns = [
    { pattern: /\s*```$/, description: 'Removed ``` suffix' },
    { pattern: /\s*\n\n.*$/s, description: 'Removed trailing content after JSON' }
  ]

  for (const { pattern, description } of suffixPatterns) {
    const newContent = content.replace(pattern, '')
    if (newContent !== content) {
      content = newContent
      attempts.push(description)
    }
  }

  // Fix single quotes to double quotes FIRST (before other quote operations)
  const doubleQuotes = content.replace(/'/g, '"')
  if (doubleQuotes !== content) {
    content = doubleQuotes
    attempts.push('Converted single quotes to double quotes')
  }

  // Fix missing quotes on property names (after quote conversion)
  const quotedProps = content.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
  if (quotedProps !== content) {
    content = quotedProps
    attempts.push('Added quotes to property names')
  }

  // Fix trailing commas (common LLM mistake)
  const noTrailingCommas = content.replace(/,(\s*[}\]])/g, '$1')
  if (noTrailingCommas !== content) {
    content = noTrailingCommas
    attempts.push('Removed trailing commas')
  }

  // Fix double escaping and other escape issues
  let fixedEscapes = content

  // Fix over-escaped quotes
  fixedEscapes = fixedEscapes.replace(/\\\\"/g, '\\"')

  // Don't escape newlines and tabs that are already in string values
  // This is more conservative than the previous approach

  if (fixedEscapes !== content) {
    content = fixedEscapes
    attempts.push('Fixed escape sequences')
  }

  return { content, attempts }
}

/**
 * Convenience function for parsing job analysis responses
 *
 * @param response - Raw API response content
 * @param config - Optional parsing configuration
 * @returns Promise resolving to parsed and validated job analysis data
 */
export async function parseJobAnalysisResponse(
  response: string,
  config?: ParseConfig
): Promise<ParseResult<JobAnalysisResponse>> {
  return parseClaudeJSON(response, JobAnalysisResponseSchema, config)
}

/**
 * Convenience function for parsing CV data responses
 *
 * @param response - Raw API response content
 * @param config - Optional parsing configuration
 * @returns Promise resolving to parsed and validated CV data
 */
export async function parseCVResponse(
  response: string,
  config?: ParseConfig
): Promise<ParseResult<CVData>> {
  return parseClaudeJSON(response, CVSchema, config)
}

/**
 * Utility function to handle API response parsing with error logging
 *
 * @param apiResponse - Full OpenAI API response object
 * @param schema - Zod schema for validation
 * @param config - Optional parsing configuration
 * @returns Promise resolving to parsed data or throwing descriptive errors
 */
export async function parseOpenAIResponse<T>(
  apiResponse: any,
  schema: z.ZodSchema<T>,
  config?: ParseConfig
): Promise<T> {
  // Extract content from OpenAI response structure
  let content: string

  try {
    if (apiResponse?.choices?.[0]?.message?.content) {
      content = apiResponse.choices[0].message.content
    } else if (typeof apiResponse === 'string') {
      content = apiResponse
    } else {
      throw new ParseError('Invalid API response structure', undefined, { apiResponse })
    }
  } catch (error) {
    throw new ParseError('Failed to extract content from API response', error, { apiResponse })
  }

  // Parse the content
  const result = await parseClaudeJSON(content, schema, config)

  if (!result.success) {
    throw result.error
  }

  return result.data!
}