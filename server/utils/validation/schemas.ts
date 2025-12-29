import { z } from "zod"

/**
 * Schema for validating personal information in a CV
 */
const PersonalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  title: z.string().min(1, "Title is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone is required"),
  location: z.string().min(1, "Location is required"),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  photo: z.string().optional(),
})

/**
 * Schema for validating work experience entries
 */
const WorkExperienceSchema = z.object({
  id: z.string().min(1, "Work experience ID is required"),
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company name is required"),
  location: z.string().min(1, "Location is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  description: z.string().min(1, "Description is required"),
  bullets: z.array(z.string()).min(1, "At least one bullet point is required"),
})

/**
 * Schema for validating education entries
 */
const EducationSchema = z.object({
  id: z.string().min(1, "Education ID is required"),
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution name is required"),
  year: z.string().min(1, "Year is required"),
  location: z.string().optional(),
  details: z.string().optional(),
  description: z.string().optional(),
})

/**
 * Schema for validating skills
 */
const SkillsSchema = z.object({
  technical: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  soft: z.array(z.string()).default([]),
})

/**
 * Schema for validating certifications
 */
const CertificationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  date: z.string().optional(),
})

/**
 * Schema for validating projects
 */
const ProjectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  url: z.string().url({ message: "Invalid project URL" }).optional(),
  date: z.string().optional(),
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
  summary: z.string().min(1, "Summary is required"),
  workExperiences: z.array(WorkExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  skills: SkillsSchema,
  certifications: z.array(CertificationSchema).default([]).optional(),
  projects: z.array(ProjectSchema).default([]).optional(),
  languages: z.array(LanguageSchema).default([]).optional(),
  references: z.array(z.any()).default([]).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  version: z.string().optional(),
  isTemplate: z.boolean().optional(),
  templateName: z.string().optional(),
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
  experienceLevel: z
    .enum(["Entry", "Junior", "Mid", "Senior", "Lead", "Executive"])
    .optional(),
  industryKeywords: z.array(z.string()).default([]),
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
