import { CVSchema } from '../validation/schemas'

/**
 * Validation result interface
 */
export interface CVValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Required fields configuration for CV validation
 */
export const REQUIRED_CV_FIELDS = {
  // Essential personal information
  personalInfo: {
    firstName: 'First name is required',
    lastName: 'Last name is required',
    email: 'Email address is required',
  },
  // At least one work experience or education entry
  minimumContent: {
    workExperienceOrEducation: 'At least one work experience or education entry is required',
  },
  // CV metadata
  metadata: {
    id: 'CV ID is required',
    createdAt: 'Creation date is required',
    updatedAt: 'Last update date is required',
    version: 'Version is required',
  },
} as const

/**
 * Recommended fields that should be present for a complete CV
 */
export const RECOMMENDED_CV_FIELDS = {
  personalInfo: {
    phone: 'Phone number is recommended',
    summary: 'Professional summary is recommended',
  },
  content: {
    skills: 'Skills section is recommended',
    workExperience: 'Work experience entries are recommended',
  },
} as const

/**
 * Validate the structure of CV data
 * @param cv The CV data to validate
 * @returns Validation result with errors and warnings
 */
export function validateCVStructure(cv: unknown): CVValidationResult {
  const result: CVValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  }

  // First, validate using Zod schema
  const zodValidation = CVSchema.safeParse(cv)

  if (!zodValidation.success) {
    result.valid = false
    // Extract meaningful error messages from Zod errors
    if (zodValidation.error?.issues) {
      zodValidation.error.issues.forEach((issue) => {
        const path = issue.path.join('.')
        result.errors.push(`${path}: ${issue.message}`)
      })
    } else {
      result.errors.push('Invalid CV structure')
    }

    // If Zod validation fails, return early as the structure is fundamentally invalid
    return result
  }

  // If Zod validation passes, proceed with custom business logic validation
  const validCV = zodValidation.data

  // Validate required personal information
  validatePersonalInfo(validCV, result)

  // Validate minimum content requirements
  validateMinimumContent(validCV, result)

  // Validate CV metadata (if it has CV-specific fields beyond the schema)
  validateMetadata(validCV, result)

  // Add warnings for recommended but missing fields
  addRecommendationWarnings(validCV, result)

  // Validate business logic constraints
  validateBusinessLogic(validCV, result)

  return result
}

/**
 * Validate personal information completeness
 */
function validatePersonalInfo(cv: any, result: CVValidationResult): void {
  const personalInfo = cv.personalInfo

  if (!personalInfo) {
    result.valid = false
    result.errors.push('Personal information section is missing')
    return
  }

  // Check required personal info fields
  if (!personalInfo.firstName?.trim()) {
    result.valid = false
    result.errors.push(REQUIRED_CV_FIELDS.personalInfo.firstName)
  }

  if (!personalInfo.lastName?.trim()) {
    result.valid = false
    result.errors.push(REQUIRED_CV_FIELDS.personalInfo.lastName)
  }

  if (!personalInfo.email?.trim()) {
    result.valid = false
    result.errors.push(REQUIRED_CV_FIELDS.personalInfo.email)
  }

  // Validate email format if present
  if (personalInfo.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(personalInfo.email)) {
      result.valid = false
      result.errors.push('Email format is invalid')
    }
  }

  // Add warnings for recommended fields
  if (!personalInfo.phone?.trim()) {
    result.warnings.push(RECOMMENDED_CV_FIELDS.personalInfo.phone)
  }
}

/**
 * Validate that CV has minimum content
 */
function validateMinimumContent(cv: any, result: CVValidationResult): void {
  const hasWorkExperience = cv.workExperience && cv.workExperience.length > 0
  const hasEducation = cv.education && cv.education.length > 0
  const hasProjects = cv.projects && cv.projects.length > 0

  if (!hasWorkExperience && !hasEducation && !hasProjects) {
    result.valid = false
    result.errors.push(REQUIRED_CV_FIELDS.minimumContent.workExperienceOrEducation)
  }

  // Validate work experience entries if present
  if (hasWorkExperience) {
    cv.workExperience.forEach((exp: any, index: number) => {
      if (!exp.company?.trim()) {
        result.errors.push(`Work experience ${index + 1}: Company name is required`)
        result.valid = false
      }
      if (!exp.position?.trim()) {
        result.errors.push(`Work experience ${index + 1}: Position is required`)
        result.valid = false
      }
      if (!exp.startDate) {
        result.errors.push(`Work experience ${index + 1}: Start date is required`)
        result.valid = false
      }
    })
  }

  // Validate education entries if present
  if (hasEducation) {
    cv.education.forEach((edu: any, index: number) => {
      if (!edu.institution?.trim()) {
        result.errors.push(`Education ${index + 1}: Institution name is required`)
        result.valid = false
      }
      if (!edu.degree?.trim()) {
        result.errors.push(`Education ${index + 1}: Degree is required`)
        result.valid = false
      }
    })
  }
}

/**
 * Validate CV metadata
 */
function validateMetadata(cv: any, result: CVValidationResult): void {
  // These are typically set by the system, but validate if present
  if ('id' in cv && !cv.id?.trim()) {
    result.warnings.push('CV ID should be set')
  }

  if ('version' in cv && !cv.version?.trim()) {
    result.warnings.push('CV version should be set')
  }

  if ('createdAt' in cv && !cv.createdAt) {
    result.warnings.push('Creation date should be set')
  }

  if ('updatedAt' in cv && !cv.updatedAt) {
    result.warnings.push('Last update date should be set')
  }
}

/**
 * Add warnings for recommended fields
 */
function addRecommendationWarnings(cv: any, result: CVValidationResult): void {
  if (!cv.summary?.trim()) {
    result.warnings.push(RECOMMENDED_CV_FIELDS.personalInfo.summary)
  }

  if (!cv.skills || cv.skills.length === 0) {
    result.warnings.push(RECOMMENDED_CV_FIELDS.content.skills)
  }

  if (!cv.workExperience || cv.workExperience.length === 0) {
    result.warnings.push(RECOMMENDED_CV_FIELDS.content.workExperience)
  }
}

/**
 * Validate business logic constraints
 */
function validateBusinessLogic(cv: any, result: CVValidationResult): void {
  // Validate date logic in work experiences
  if (cv.workExperience) {
    cv.workExperience.forEach((exp: any, index: number) => {
      if (exp.startDate && exp.endDate) {
        const start = new Date(exp.startDate)
        const end = new Date(exp.endDate)

        if (start > end) {
          result.valid = false
          result.errors.push(`Work experience ${index + 1}: Start date cannot be after end date`)
        }
      }

      // If marked as current position, should not have end date
      if (exp.current && exp.endDate) {
        result.warnings.push(`Work experience ${index + 1}: Current position should not have an end date`)
      }
    })
  }

  // Validate date logic in education
  if (cv.education) {
    cv.education.forEach((edu: any, index: number) => {
      if (edu.startDate && edu.endDate) {
        const start = new Date(edu.startDate)
        const end = new Date(edu.endDate)

        if (start > end) {
          result.valid = false
          result.errors.push(`Education ${index + 1}: Start date cannot be after end date`)
        }
      }
    })
  }

  // Validate projects date logic
  if (cv.projects) {
    cv.projects.forEach((project: any, index: number) => {
      if (project.startDate && project.endDate) {
        const start = new Date(project.startDate)
        const end = new Date(project.endDate)

        if (start > end) {
          result.valid = false
          result.errors.push(`Project ${index + 1}: Start date cannot be after end date`)
        }
      }
    })
  }

  // Validate certification expiry dates
  if (cv.certifications) {
    cv.certifications.forEach((cert: any, index: number) => {
      if (cert.issueDate && cert.expiryDate) {
        const issue = new Date(cert.issueDate)
        const expiry = new Date(cert.expiryDate)

        if (issue > expiry) {
          result.valid = false
          result.errors.push(`Certification ${index + 1}: Issue date cannot be after expiry date`)
        }

        // Warn about expired certifications
        if (expiry < new Date()) {
          result.warnings.push(`Certification ${index + 1}: "${cert.name}" has expired`)
        }
      }
    })
  }
}

/**
 * Utility function to check if CV has minimum required content for job applications
 * @param cv The CV to validate
 * @returns boolean indicating if CV is ready for job applications
 */
export function isCVReadyForJobApplication(cv: unknown): boolean {
  const validation = validateCVStructure(cv)

  // Must be valid and have minimal warnings
  if (!validation.valid) {
    return false
  }

  // Check for critical warnings that would make CV unsuitable
  const criticalWarnings = validation.warnings.filter(warning =>
    warning.includes('Professional summary') ||
    warning.includes('Skills section') ||
    warning.includes('Work experience entries')
  )

  return criticalWarnings.length === 0
}

/**
 * Get a summary of CV completeness
 * @param cv The CV to analyze
 * @returns Object with completeness metrics
 */
export function getCVCompleteness(cv: unknown): {
  score: number
  missingRequired: string[]
  missingRecommended: string[]
  totalSections: number
  completedSections: number
} {
  const validation = validateCVStructure(cv)

  const sections = [
    'personalInfo',
    'workExperience',
    'education',
    'skills',
    'projects',
    'certifications',
    'languages'
  ]

  let completedSections = 0
  const cvData = cv as any

  sections.forEach(section => {
    if (section === 'personalInfo') {
      if (cvData?.personalInfo?.firstName && cvData?.personalInfo?.lastName && cvData?.personalInfo?.email) {
        completedSections++
      }
    } else {
      if (cvData?.[section] && Array.isArray(cvData[section]) && cvData[section].length > 0) {
        completedSections++
      }
    }
  })

  const score = Math.round((completedSections / sections.length) * 100)

  return {
    score,
    missingRequired: validation.errors,
    missingRecommended: validation.warnings,
    totalSections: sections.length,
    completedSections
  }
}