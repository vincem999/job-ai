import { defineEventHandler, readBody } from 'h3'
import { getOpenAIClient } from '../utils/openai/client'
import { generateCoverLetterPrompt } from '../utils/openai/prompts'
import { parseOpenAIResponse } from '../utils/openai/parser'
import {
  CoverLetterRequestSchema,
  type CoverLetterRequest,
} from '../utils/validation/schemas'
import { handleError, createAppError } from '../utils/errorHandler'
import { sanitizeForDisplay } from '../utils/validation/sanitize'
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

    // Parse and validate request body
    const body = await readBody(event)

    // Transform date strings to Date objects for validation
    const transformedBody = {
      ...body,
      cvData: {
        ...body.cvData,
        createdAt: new Date(body.cvData.createdAt),
        updatedAt: new Date(body.cvData.updatedAt),
        workExperience: body.cvData.workExperience?.map((exp: any) => ({
          ...exp,
          startDate: new Date(exp.startDate),
          endDate: exp.endDate ? new Date(exp.endDate) : undefined,
        })) || [],
        education: body.cvData.education?.map((edu: any) => ({
          ...edu,
          startDate: new Date(edu.startDate),
          endDate: edu.endDate ? new Date(edu.endDate) : undefined,
        })) || [],
        certifications: body.cvData.certifications?.map((cert: any) => ({
          ...cert,
          issueDate: new Date(cert.issueDate),
          expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : undefined,
        })) || [],
        projects: body.cvData.projects?.map((proj: any) => ({
          ...proj,
          startDate: new Date(proj.startDate),
          endDate: proj.endDate ? new Date(proj.endDate) : undefined,
        })) || [],
      }
    }

    const validationResult = CoverLetterRequestSchema.safeParse(transformedBody)

    if (!validationResult.success) {
      console.error('❌ API: Invalid request data:', validationResult.error.issues)
      throw createAppError.validation(
        'Invalid request data',
        { validationErrors: validationResult.error.issues }
      )
    }

    const requestData: CoverLetterRequest = validationResult.data

    // Sanitize text fields in CV data to prevent XSS
    const sanitizedRequest: CoverLetterRequest = {
      ...requestData,
      cvData: {
        ...requestData.cvData,
        personalInfo: {
          ...requestData.cvData.personalInfo,
          firstName: sanitizeForDisplay(requestData.cvData.personalInfo.firstName),
          lastName: sanitizeForDisplay(requestData.cvData.personalInfo.lastName),
          email: sanitizeForDisplay(requestData.cvData.personalInfo.email),
          summary: requestData.cvData.personalInfo.summary
            ? sanitizeForDisplay(requestData.cvData.personalInfo.summary)
            : undefined,
        },
        workExperience: requestData.cvData.workExperience.map(exp => ({
          ...exp,
          company: sanitizeForDisplay(exp.company),
          position: sanitizeForDisplay(exp.position),
          description: sanitizeForDisplay(exp.description),
          achievements: exp.achievements.map(achievement => sanitizeForDisplay(achievement)),
        })),
      },
      personalMessage: requestData.personalMessage
        ? sanitizeForDisplay(requestData.personalMessage)
        : undefined,
    }

    console.log(`📝 API: Generating cover letter for ${sanitizedRequest.cvData.personalInfo.firstName} ${sanitizedRequest.cvData.personalInfo.lastName}`)

    // Generate prompt for OpenAI
    const prompt = generateCoverLetterPrompt(sanitizedRequest, { maxLength: 800 })
    console.log('📝 API: Generated cover letter prompt')

    // Get OpenAI client and make API call
    const openai = getOpenAIClient()

    console.log('🤖 API: Calling OpenAI API for cover letter generation...')
    const completion = await openai.chat.completions.create({
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
    })

    console.log('✅ API: OpenAI API call successful')

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