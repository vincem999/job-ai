import { readBody, type H3Event } from 'h3'
import type { ZodType } from 'zod'
import { createAppError } from '../errorHandler'
import { sanitizeForDisplay } from './sanitize'

/**
 * Configuration options for validation middleware
 */
export interface ValidationOptions {
  /**
   * Whether to apply CV-specific date transformations
   * Required for schemas that contain nested CV data with date fields
   */
  transformDates?: boolean

  /**
   * Whether to apply sanitization to text fields
   * Defaults to true for security
   */
  sanitize?: boolean

  /**
   * Custom sanitization function
   * If not provided, uses the default sanitizeForDisplay
   */
  sanitizer?: (value: string) => string
}

/**
 * Safely converts date strings to Date objects
 * Handles undefined, null, and invalid date strings gracefully
 */
const safeParseDate = (dateString: any): Date | undefined => {
  if (!dateString || dateString === null) {
    return undefined
  }

  // If it's already a Date, return it
  if (dateString instanceof Date) {
    return dateString
  }

  // If it's a string, try to parse it
  if (typeof dateString === 'string') {
    const parsed = new Date(dateString)
    // Check if the date is valid
    if (isNaN(parsed.getTime())) {
      return undefined
    }
    return parsed
  }

  return undefined
}

/**
 * Transforms date strings to Date objects for CV data validation
 * This handles the complex nested structure of CV schemas
 */
const transformCVDates = (body: any): any => {
  if (!body.cvData) {
    return body
  }

  return {
    ...body,
    cvData: {
      ...body.cvData,
      createdAt: safeParseDate(body.cvData.createdAt),
      updatedAt: safeParseDate(body.cvData.updatedAt),
      workExperience: body.cvData.workExperience?.map((exp: any) => ({
        ...exp,
        startDate: safeParseDate(exp.startDate),
        endDate: safeParseDate(exp.endDate),
      })) || [],
      education: body.cvData.education?.map((edu: any) => ({
        ...edu,
        startDate: safeParseDate(edu.startDate),
        endDate: safeParseDate(edu.endDate),
      })) || [],
      certifications: body.cvData.certifications?.map((cert: any) => ({
        ...cert,
        issueDate: safeParseDate(cert.issueDate),
        expiryDate: safeParseDate(cert.expiryDate),
      })) || [],
      projects: body.cvData.projects?.map((proj: any) => ({
        ...proj,
        startDate: safeParseDate(proj.startDate),
        endDate: safeParseDate(proj.endDate),
      })) || [],
    }
  }
}

/**
 * Recursively sanitizes string fields in an object
 * Preserves the structure while sanitizing text content
 */
const deepSanitize = (obj: any, sanitizer: (value: string) => string): any => {
  if (typeof obj === 'string') {
    return sanitizer(obj)
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepSanitize(item, sanitizer))
  }

  if (obj && typeof obj === 'object' && obj.constructor === Object) {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = deepSanitize(value, sanitizer)
    }
    return sanitized
  }

  return obj
}

/**
 * Validates request body against a Zod schema with optional transformations
 *
 * @param event - H3 event object containing the request
 * @param schema - Zod schema to validate against
 * @param options - Configuration options for validation
 * @returns Validated and potentially transformed/sanitized data
 * @throws AppError with validation details if validation fails
 */
export async function validateRequestBody<T>(
  event: H3Event,
  schema: ZodType<T>,
  options: ValidationOptions = {}
): Promise<T> {
  const {
    transformDates = false,
    sanitize = true,
    sanitizer = sanitizeForDisplay
  } = options

  try {
    // Read the request body
    const body = await readBody(event)

    // Apply date transformations if requested
    const transformedBody = transformDates ? transformCVDates(body) : body

    // Validate against schema
    const validationResult = schema.safeParse(transformedBody)

    if (!validationResult.success) {
      console.error('❌ Validation: Invalid request data:', validationResult.error.issues)
      throw createAppError.validation(
        'Invalid request data',
        { validationErrors: validationResult.error.issues }
      )
    }

    // Apply sanitization if requested
    const validatedData = validationResult.data
    if (sanitize) {
      return deepSanitize(validatedData, sanitizer) as T
    }

    return validatedData
  } catch (error) {
    // Re-throw validation errors as-is
    if (error && typeof error === 'object' && 'code' in error) {
      throw error
    }

    // Wrap unexpected errors
    console.error('❌ Validation: Unexpected error during validation:', error)
    throw createAppError.validation(
      'Failed to process request body',
      { originalError: error instanceof Error ? error.message : String(error) }
    )
  }
}

/**
 * Convenience function for validating job analysis requests
 */
export async function validateJobAnalysisRequest(event: H3Event) {
  const { JobAnalysisRequestSchema } = await import('./schemas')
  return validateRequestBody(event, JobAnalysisRequestSchema, {
    transformDates: false,
    sanitize: true
  })
}

/**
 * Convenience function for validating CV adaptation requests
 */
export async function validateCVAdaptationRequest(event: H3Event) {
  const { CVAdaptationRequestSchema } = await import('./schemas')
  return validateRequestBody(event, CVAdaptationRequestSchema, {
    transformDates: true,
    sanitize: true
  })
}

/**
 * Convenience function for validating cover letter requests
 */
export async function validateCoverLetterRequest(event: H3Event) {
  const { CoverLetterRequestSchema } = await import('./schemas')
  return validateRequestBody(event, CoverLetterRequestSchema, {
    transformDates: true,
    sanitize: true
  })
}

// Types are already exported inline with the interface declaration