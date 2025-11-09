import { defineEventHandler } from 'h3'
import { createChatCompletionWithRetry } from '../utils/openai/client'
import { generateCoverLetterPrompt } from '../utils/openai/prompts'
import { parseOpenAIResponse } from '../utils/openai/parser'
import type { CoverLetterRequest } from '../utils/validation/schemas'
import { handleError } from '../utils/errorHandler'
import { validateCoverLetterRequest } from '../utils/validation/middleware'
import { z } from 'zod'

/**
 * Schema for validating cover letter generation response from OpenAI
 */
const CoverLetterResponseSchema = z.object({
  coverLetter: z.object({
    header: z.object({
      candidateName: z.string(),
      candidateEmail: z.string(),
      date: z.string(),
      recipientInfo: z.string(),
    }),
    content: z.object({
      opening: z.string(),
      bodyParagraph1: z.string(),
      bodyParagraph2: z.string(),
      closing: z.string(),
    }),
    fullText: z.string(),
    wordCount: z.number(),
    keyHighlights: z.array(z.string()),
  }),
  matchingElements: z.object({
    addressedRequirements: z.array(z.string()),
    highlightedSkills: z.array(z.string()),
    quantifiedAchievements: z.array(z.string()),
  }),
  suggestions: z.array(z.string()),
})

type CoverLetterResponse = z.infer<typeof CoverLetterResponseSchema>

/**
 * API endpoint to generate cover letters based on CV and job analysis
 * POST /api/generate-letter
 *
 * Takes CV data and job analysis to generate a personalized cover letter
 * that highlights the candidate's fit for the specific role.
 */
export default defineEventHandler(async (event) => {
  const startTime = Date.now()

  try {
    console.log('💌 API: Starting cover letter generation...')

    // Validate, transform, and sanitize request body using middleware
    const sanitizedRequest: CoverLetterRequest = await validateCoverLetterRequest(event)

    console.log(`📝 API: Generating cover letter for ${sanitizedRequest.cvData.personalInfo.firstName} ${sanitizedRequest.cvData.personalInfo.lastName}`)

    // Generate prompt for OpenAI
    const prompt = generateCoverLetterPrompt(sanitizedRequest, { maxLength: 800 })
    console.log('📝 API: Generated cover letter prompt')

    // Make API call with retry logic
    console.log('🤖 API: Calling OpenAI API for cover letter generation with retry logic...')
    const completion = await createChatCompletionWithRetry({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en rédaction de lettres de motivation et conseiller en carrière. Réponds toujours en JSON valide uniquement.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    }, {
      maxRetries: 3, // Standard retry count for letter generation
      initialDelay: 800
    })

    // Log the raw response for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('🐛 API: Raw OpenAI response:', completion.choices[0]?.message?.content)
    }

    // Parse and validate the response using the existing parser
    const letterData: CoverLetterResponse = await parseOpenAIResponse(
      completion,
      CoverLetterResponseSchema,
      {
        attemptRepair: true,
        extractFromMarkdown: true,
        debug: process.env.NODE_ENV === 'development'
      }
    )

    const processingTime = Date.now() - startTime
    console.log(`💌 API: Cover letter generation completed successfully in ${processingTime}ms`)

    return {
      success: true,
      data: letterData,
      processingTime,
      timestamp: new Date()
    }

  } catch (error) {
    const processingTime = Date.now() - startTime
    console.error(`❌ API: Cover letter generation failed after ${processingTime}ms:`, error)

    // Use existing error handler for consistent error responses
    return handleError(error, event)
  }
})