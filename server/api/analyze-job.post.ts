import { defineEventHandler } from 'h3'
import { createChatCompletionWithRetry } from '../utils/openai/client'
import { generateJobAnalysisPrompt } from '../utils/openai/prompts'
import { parseOpenAIResponse } from '../utils/openai/parser'
import {
  JobAnalysisResponseSchema,
  type JobAnalysisRequest,
  type JobAnalysisResponse
} from '../utils/validation/schemas'
import { handleError } from '../utils/errorHandler'
import { validateJobAnalysisRequest } from '../utils/validation/middleware'

/**
 * API endpoint to analyze job offers using OpenAI API
 * POST /api/analyze-job
 *
 * Analyzes job offer text and extracts structured information including:
 * - Required and preferred skills
 * - Responsibilities and requirements
 * - Work type, location, and experience level
 * - Industry keywords and suggestions
 */
export default defineEventHandler(async (event) => {
  const startTime = Date.now()

  try {
    console.log('🔍 API: Starting job offer analysis...')

    // Validate and sanitize request body using middleware
    const sanitizedRequest: JobAnalysisRequest = await validateJobAnalysisRequest(event)

    console.log(`📋 API: Analyzing job offer (${sanitizedRequest.jobOffer.length} characters)`)

    // Generate prompt for OpenAI
    const prompt = generateJobAnalysisPrompt(sanitizedRequest)
    console.log('📝 API: Generated analysis prompt')

    // Make API call with retry logic
    console.log('🤖 API: Calling OpenAI API with retry logic...')
    const completion = await createChatCompletionWithRetry({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en analyse d\'offres d\'emploi. Réponds toujours en JSON valide uniquement.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    }, {
      maxRetries: 5, // Higher retry count for critical analysis
      initialDelay: 1500
    })

    // Parse and validate the response using the existing parser
    const analysisData: JobAnalysisResponse = await parseOpenAIResponse(
      completion,
      JobAnalysisResponseSchema,
      {
        attemptRepair: true,
        extractFromMarkdown: true,
        debug: process.env.NODE_ENV === 'development'
      }
    )

    const processingTime = Date.now() - startTime
    console.log(`🎯 API: Job analysis completed successfully in ${processingTime}ms`)

    return {
      success: true,
      data: analysisData,
      processingTime,
      timestamp: new Date()
    }

  } catch (error) {
    const processingTime = Date.now() - startTime
    console.error(`❌ API: Job analysis failed after ${processingTime}ms:`, error)

    // Use existing error handler for consistent error responses
    return handleError(error, event)
  }
})