import { z } from 'zod'

/**
 * Schema for validating personal information in a CV
 */
const PersonalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
})

/**
 * Schema for validating work experience entries
 */
const WorkExperienceSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
  achievements: z.array(z.string()).default([]),
  location: z.string().optional(),
})

/**
 * Schema for validating education entries
 */
const EducationSchema = z.object({
  institution: z.string().min(1, 'Institution name is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
  description: z.string().optional(),
})

/**
 * Schema for validating skills
 */
const SkillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).optional(),
  category: z.string().optional(),
})

/**
 * Schema for validating certifications
 */
const CertificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  date: z.string().optional(),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  url: z.string().url().optional(),
})

/**
 * Schema for validating projects
 */
const ProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  url: z.string().url().optional(),
  github: z.string().url().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

/**
 * Schema for validating languages
 */
const LanguageSchema = z.object({
  name: z.string().min(1, 'Language name is required'),
  level: z.enum(['Basic', 'Conversational', 'Professional', 'Native']).optional(),
})

/**
 * Complete CV schema that validates the entire CV structure
 */
export const CVSchema = z.object({
  personalInfo: PersonalInfoSchema,
  summary: z.string().optional(),
  workExperience: z.array(WorkExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  skills: z.array(SkillSchema).default([]),
  certifications: z.array(CertificationSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  languages: z.array(LanguageSchema).default([]),
})

/**
 * Type inference for CV data
 */
export type CVData = z.infer<typeof CVSchema>

/**
 * Schema for validating job analysis request data
 */
export const JobAnalysisRequestSchema = z.object({
  jobOffer: z.string().min(10, 'Job offer text must be at least 10 characters'),
  company: z.string().optional(),
  position: z.string().optional(),
  additionalContext: z.string().optional(),
})

/**
 * Schema for validating job analysis response data
 */
export const JobAnalysisResponseSchema = z.object({
  requiredSkills: z.array(z.string()),
  preferredSkills: z.array(z.string()),
  responsibilities: z.array(z.string()),
  requirements: z.array(z.string()),
  benefits: z.array(z.string()).optional(),
  salaryRange: z.string().optional(),
  workLocation: z.string().optional(),
  workType: z.enum(['Remote', 'Hybrid', 'On-site']).optional(),
  experienceLevel: z.enum(['Entry', 'Junior', 'Mid', 'Senior', 'Lead', 'Executive']).optional(),
  industryKeywords: z.array(z.string()).default([]),
  matchingScore: z.number().min(0).max(100).optional(),
  suggestions: z.array(z.string()).default([]),
})

/**
 * Type inference for job analysis data
 */
export type JobAnalysisRequest = z.infer<typeof JobAnalysisRequestSchema>
export type JobAnalysisResponse = z.infer<typeof JobAnalysisResponseSchema>

/**
 * Schema for validating CV adaptation request
 */
export const CVAdaptationRequestSchema = z.object({
  cvData: CVSchema,
  jobAnalysis: JobAnalysisResponseSchema,
  focusAreas: z.array(z.string()).optional(),
})

/**
 * Schema for validating cover letter generation request
 */
export const CoverLetterRequestSchema = z.object({
  cvData: CVSchema,
  jobAnalysis: JobAnalysisResponseSchema,
  personalMessage: z.string().optional(),
  tone: z.enum(['Professional', 'Friendly', 'Enthusiastic', 'Formal']).default('Professional'),
})

/**
 * Type inference for request schemas
 */
export type CVAdaptationRequest = z.infer<typeof CVAdaptationRequestSchema>
export type CoverLetterRequest = z.infer<typeof CoverLetterRequestSchema>

/**
 * Utility function to safely parse CV data
 */
export function parseCV(data: unknown): { success: true; data: CVData } | { success: false; error: z.ZodError } {
  const result = CVSchema.safeParse(data)
  return result
}

/**
 * Utility function to safely parse job analysis request
 */
export function parseJobAnalysisRequest(data: unknown): { success: true; data: JobAnalysisRequest } | { success: false; error: z.ZodError } {
  const result = JobAnalysisRequestSchema.safeParse(data)
  return result
}

/**
 * Utility function to safely parse job analysis response
 */
export function parseJobAnalysisResponse(data: unknown): { success: true; data: JobAnalysisResponse } | { success: false; error: z.ZodError } {
  const result = JobAnalysisResponseSchema.safeParse(data)
  return result
}

/**
 * Utility function to safely parse CV adaptation request
 */
export function parseCVAdaptationRequest(data: unknown): { success: true; data: CVAdaptationRequest } | { success: false; error: z.ZodError } {
  const result = CVAdaptationRequestSchema.safeParse(data)
  return result
}

/**
 * Utility function to safely parse cover letter request
 */
export function parseCoverLetterRequest(data: unknown): { success: true; data: CoverLetterRequest } | { success: false; error: z.ZodError } {
  const result = CoverLetterRequestSchema.safeParse(data)
  return result
}