import { defineEventHandler, readBody } from 'h3'
import { getOpenAIClient } from '../utils/openai/client'
import { generateCVAdaptationPrompt } from '../utils/openai/prompts'
import { parseOpenAIResponse } from '../utils/openai/parser'
import {
  CVAdaptationRequestSchema,
  type CVAdaptationRequest,
} from '../utils/validation/schemas'
import { handleError, createAppError } from '../utils/errorHandler'
import { sanitizeForDisplay } from '../utils/validation/sanitize'
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

    const validationResult = CVAdaptationRequestSchema.safeParse(transformedBody)

    if (!validationResult.success) {
      console.error('❌ API: Invalid request data:', validationResult.error.issues)
      throw createAppError.validation(
        'Invalid request data',
        { validationErrors: validationResult.error.issues }
      )
    }

    const requestData: CVAdaptationRequest = validationResult.data

    // Sanitize text fields in CV data to prevent XSS
    const sanitizedRequest: CVAdaptationRequest = {
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
      focusAreas: requestData.focusAreas?.map(area => sanitizeForDisplay(area)),
    }

    console.log(`📋 API: Adapting CV for ${sanitizedRequest.cvData.personalInfo.firstName} ${sanitizedRequest.cvData.personalInfo.lastName}`)

    // Generate prompt for OpenAI
    const prompt = generateCVAdaptationPrompt(
      sanitizedRequest.cvData,
      sanitizedRequest.jobAnalysis,
      sanitizedRequest.focusAreas || [],
      { maxLength: 2000 }
    )
    console.log('📝 API: Generated CV adaptation prompt')

    // Get OpenAI client and make API call
    const openai = getOpenAIClient()

    console.log('🤖 API: Calling OpenAI API for CV adaptation...')
    const completion = await openai.chat.completions.create({
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
    })

    console.log('✅ API: OpenAI API call successful')

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