import { defineEventHandler, readBody } from 'h3'
import { getOpenAIClient } from '../utils/openai/client'
import { generateJobAnalysisPrompt } from '../utils/openai/prompts'
import { parseOpenAIResponse } from '../utils/openai/parser'
import {
  JobAnalysisRequestSchema,
  JobAnalysisResponseSchema,
  type JobAnalysisRequest,
  type JobAnalysisResponse
} from '../utils/validation/schemas'
import { handleError, createAppError } from '../utils/errorHandler'
import { sanitizeForDisplay } from '../utils/validation/sanitize'

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

    // Parse and validate request body
    const body = await readBody(event)
    const validationResult = JobAnalysisRequestSchema.safeParse(body)

    if (!validationResult.success) {
      console.error('❌ API: Invalid request data:', validationResult.error.issues)
      throw createAppError.validation(
        'Invalid request data',
        { validationErrors: validationResult.error.issues }
      )
    }

    const requestData: JobAnalysisRequest = validationResult.data

    // Sanitize input text to prevent XSS and other issues
    const sanitizedJobOffer = sanitizeForDisplay(requestData.jobOffer)
    const sanitizedRequest: JobAnalysisRequest = {
      ...requestData,
      jobOffer: sanitizedJobOffer,
      company: requestData.company ? sanitizeForDisplay(requestData.company) : undefined,
      position: requestData.position ? sanitizeForDisplay(requestData.position) : undefined,
      additionalContext: requestData.additionalContext ? sanitizeForDisplay(requestData.additionalContext) : undefined,
    }

    console.log(`📋 API: Analyzing job offer (${sanitizedJobOffer.length} characters)`)

    // Generate prompt for OpenAI
    const prompt = generateJobAnalysisPrompt(sanitizedRequest)
    console.log('📝 API: Generated analysis prompt')

    // Get OpenAI client and make API call
    const openai = getOpenAIClient()

    console.log('🤖 API: Calling OpenAI API...')
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
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
    })

    console.log('✅ API: OpenAI API call successful')

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