import { defineEventHandler } from 'h3'
import { createChatCompletionWithRetry } from '../utils/openai/client'
import { generateCVAdaptationPrompt } from '../utils/openai/prompts'
import { parseOpenAIResponse } from '../utils/openai/parser'
import type { CVAdaptationRequest } from '../utils/validation/schemas'
import { handleError } from '../utils/errorHandler'
import { validateCVAdaptationRequest } from '../utils/validation/middleware'
import { z } from 'zod'

/**
 * Schema for validating CV adaptation response from OpenAI
 */
const CVAdaptationResponseSchema = z.object({
  adaptedPersonalInfo: z.object({
    summary: z.string(),
  }),
  prioritizedWorkExperience: z.array(z.object({
    id: z.string(),
    enhancedDescription: z.string(),
    highlightedAchievements: z.array(z.string()),
    relevantSkills: z.array(z.string()),
    matchingScore: z.number(),
  })),
  optimizedSkills: z.array(z.object({
    id: z.string(),
    priority: z.enum(['high', 'medium', 'low']),
    justification: z.string(),
  })),
  recommendedSections: z.object({
    order: z.array(z.string()),
    emphasis: z.record(z.string(), z.enum(['high', 'medium', 'low'])),
  }),
  keywordOptimization: z.object({
    addedKeywords: z.array(z.string()),
    naturalPlacements: z.array(z.object({
      keyword: z.string(),
      section: z.string(),
      context: z.string(),
    })),
  }),
  improvementSuggestions: z.array(z.string()),
  overallMatchScore: z.number().min(0).max(100),
  strengthsHighlighted: z.array(z.string()),
  gapsToAddress: z.array(z.string()),
})

type CVAdaptationResponse = z.infer<typeof CVAdaptationResponseSchema>

/**
 * API endpoint to adapt CVs based on job analysis
 * POST /api/adapt-cv
 *
 * Takes a CV and job analysis data and returns optimized CV content
 * that better matches the job requirements while maintaining authenticity.
 */
export default defineEventHandler(async (event) => {
  const startTime = Date.now()

  try {
    console.log('🎯 API: Starting CV adaptation...')

    // Validate, transform, and sanitize request body using middleware
    const sanitizedRequest: CVAdaptationRequest = await validateCVAdaptationRequest(event)

    console.log(`📋 API: Adapting CV for ${sanitizedRequest.cvData.personalInfo.firstName} ${sanitizedRequest.cvData.personalInfo.lastName}`)

    // Generate prompt for OpenAI
    const prompt = generateCVAdaptationPrompt(
      sanitizedRequest.cvData,
      sanitizedRequest.jobAnalysis,
      sanitizedRequest.focusAreas || [],
      { maxLength: 2000 }
    )
    console.log('📝 API: Generated CV adaptation prompt')

    // Make API call with retry logic
    console.log('🤖 API: Calling OpenAI API for CV adaptation with retry logic...')
    const completion = await createChatCompletionWithRetry({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en rédaction de CV et conseiller en carrière. Réponds toujours en JSON valide uniquement.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2500,
      response_format: { type: 'json_object' }
    }, {
      maxRetries: 4, // Medium retry count for CV adaptation
      initialDelay: 1000
    })

    // Log the raw response for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('🐛 API: Raw OpenAI response:', completion.choices[0]?.message?.content)
    }

    // Parse and validate the response using the existing parser
    const adaptationData: CVAdaptationResponse = await parseOpenAIResponse(
      completion,
      CVAdaptationResponseSchema,
      {
        attemptRepair: true,
        extractFromMarkdown: true,
        debug: process.env.NODE_ENV === 'development'
      }
    )

    const processingTime = Date.now() - startTime
    console.log(`🎯 API: CV adaptation completed successfully in ${processingTime}ms`)

    return {
      success: true,
      data: adaptationData,
      processingTime,
      timestamp: new Date()
    }

  } catch (error) {
    const processingTime = Date.now() - startTime
    console.error(`❌ API: CV adaptation failed after ${processingTime}ms:`, error)

    // Use existing error handler for consistent error responses
    return handleError(error, event)
  }
})