import { z } from "zod"

/**
 * Schema for validating address information
 */
const AddressSchema = z.object({
  street: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().min(1, "Country is required"),
})

/**
 * Schema for validating personal information in a CV
 */
const PersonalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  address: AddressSchema.optional(),
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
  website: z.string().url().optional(),
  summary: z.string().optional(),
})

/**
 * Schema for validating work experience entries
 */
const WorkExperienceSchema = z.object({
  id: z.string().min(1, "Work experience ID is required"),
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.date(),
  endDate: z.date().optional(),
  isCurrentPosition: z.boolean().default(false),
  location: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  achievements: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
})

/**
 * Schema for validating education entries
 */
const EducationSchema = z.object({
  id: z.string().min(1, "Education ID is required"),
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().min(1, "Field is required"),
  startDate: z.date(),
  endDate: z.date().optional(),
  isCurrentEducation: z.boolean().default(false),
  gpa: z.number().optional(),
  honors: z.array(z.string()).default([]),
  relevantCourses: z.array(z.string()).default([]),
  description: z.string().optional(),
})

/**
 * Schema for validating skills
 */
const SkillSchema = z.object({
  id: z.string().min(1, "Skill ID is required"),
  name: z.string().min(1, "Skill name is required"),
  level: z.enum([
    "beginner",
    "intermediate",
    "advanced",
    "expert",
    "professional",
  ]),
  category: z.string().min(1, "Category is required"),
  keywords: z.array(z.string()).default([]),
  yearsOfExperience: z.number().optional(),
})

/**
 * Schema for validating certifications
 */
const CertificationSchema = z.object({
  id: z.string().min(1, "Certification ID is required"),
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issueDate: z.date(),
  expiryDate: z.date().optional(),
  credentialId: z.string().optional(),
  verificationUrl: z.string().url().optional(),
  description: z.string().optional(),
})

/**
 * Schema for validating projects
 */
const ProjectSchema = z.object({
  id: z.string().min(1, "Project ID is required"),
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Project description is required"),
  startDate: z.date(),
  endDate: z.date().optional(),
  isCurrentProject: z.boolean().default(false),
  technologies: z.array(z.string()).default([]),
  role: z.string().optional(),
  teamSize: z.number().optional(),
  achievements: z.array(z.string()).default([]),
  url: z.string().url().optional(),
  github: z.string().url().optional(),
})

/**
 * Schema for validating languages
 */
const LanguageSchema = z.object({
  id: z.string().min(1, "Language ID is required"),
  name: z.string().min(1, "Language name is required"),
  level: z.enum(["basic", "conversational", "professional", "native"]),
  certifications: z.array(z.string()).default([]),
})

/**
 * Complete CV schema that validates the entire CV structure
 */
export const CVSchema = z.object({
  id: z.string().min(1, "CV ID is required"),
  personalInfo: PersonalInfoSchema,
  WorkExperiencess: z.array(WorkExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  skills: z.array(SkillSchema).default([]),
  certifications: z.array(CertificationSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  languages: z.array(LanguageSchema).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
  version: z.string().min(1, "Version is required"),
})

/**
 * Type inference for CV data
 */
export type CVData = z.infer<typeof CVSchema>

/**
 * Schema for validating job analysis request data
 */
export const JobAnalysisRequestSchema = z.object({
  jobOffer: z.string().min(10, "Job offer text must be at least 10 characters"),
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
  salaryRange: z.string().nullable().optional(),
  workLocation: z.string().optional(),
  workType: z.enum(["Remote", "Hybrid", "On-site"]).optional(),
  experienceLevel: z
    .enum(["Entry", "Junior", "Mid", "Senior", "Lead", "Executive"])
    .optional(),
  industryKeywords: z.array(z.string()).default([]),
  matchingScore: z.number().min(0).max(100).nullable().optional(),
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
  tone: z
    .enum(["Professional", "Friendly", "Enthusiastic", "Formal"])
    .default("Professional"),
})

/**
 * Type inference for request schemas
 */
export type CVAdaptationRequest = z.infer<typeof CVAdaptationRequestSchema>
export type CoverLetterRequest = z.infer<typeof CoverLetterRequestSchema>

/**
 * Utility function to safely parse CV data
 */
export function parseCV(
  data: unknown
): { success: true; data: CVData } | { success: false; error: z.ZodError } {
  const result = CVSchema.safeParse(data)
  return result
}

/**
 * Utility function to safely parse job analysis request
 */
export function parseJobAnalysisRequest(
  data: unknown
):
  | { success: true; data: JobAnalysisRequest }
  | { success: false; error: z.ZodError } {
  const result = JobAnalysisRequestSchema.safeParse(data)
  return result
}

/**
 * Utility function to safely parse CV adaptation request
 */
export function parseCVAdaptationRequest(
  data: unknown
):
  | { success: true; data: CVAdaptationRequest }
  | { success: false; error: z.ZodError } {
  const result = CVAdaptationRequestSchema.safeParse(data)
  return result
}

/**
 * Utility function to safely parse cover letter request
 */
export function parseCoverLetterRequest(
  data: unknown
):
  | { success: true; data: CoverLetterRequest }
  | { success: false; error: z.ZodError } {
  const result = CoverLetterRequestSchema.safeParse(data)
  return result
}
