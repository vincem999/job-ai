// CV Data Type Definitions

export interface PersonalInfo {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: Address
  linkedin?: string
  github?: string
  website?: string
  summary?: string
}

export interface Address {
  street?: string
  city: string
  state?: string
  zipCode?: string
  country: string
}

export interface WorkExperience {
  id: string
  company: string
  position: string
  startDate: Date
  endDate?: Date
  isCurrentPosition: boolean
  location?: string
  description: string
  achievements: string[]
  skills: string[]
  technologies: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: Date
  endDate?: Date
  isCurrentEducation: boolean
  gpa?: number
  honors?: string[]
  relevantCourses?: string[]
  description?: string
}

export interface Skill {
  id: string
  name: string
  category: SkillCategory
  level: SkillLevel
  keywords: string[]
  yearsOfExperience?: number
}

export enum SkillCategory {
  TECHNICAL = 'technical',
  SOFT = 'soft',
  LANGUAGE = 'language',
  CERTIFICATION = 'certification',
  TOOL = 'tool',
  FRAMEWORK = 'framework'
}

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export interface Project {
  id: string
  name: string
  description: string
  role: string
  startDate: Date
  endDate?: Date
  isOngoing: boolean
  technologies: string[]
  achievements: string[]
  url?: string
  repository?: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: Date
  expiryDate?: Date
  credentialId?: string
  credentialUrl?: string
  description?: string
}

export interface Language {
  id: string
  name: string
  level: LanguageLevel
  certifications?: string[]
}

export enum LanguageLevel {
  BASIC = 'basic',
  CONVERSATIONAL = 'conversational',
  FLUENT = 'fluent',
  NATIVE = 'native'
}

export interface Reference {
  id: string
  name: string
  position: string
  company: string
  email?: string
  phone?: string
  relationship: string
}

export interface CV {
  id: string
  personalInfo: PersonalInfo
  workExperience: WorkExperience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  certifications: Certification[]
  languages: Language[]
  references: Reference[]
  createdAt: Date
  updatedAt: Date
  version: string
  isTemplate: boolean
  templateName?: string
}

export interface CVTemplate {
  id: string
  name: string
  description: string
  cv: CV
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

// Adapted CV for specific job applications
export interface AdaptedCV extends CV {
  originalCVId: string
  jobAnalysisId: string
  adaptations: CVAdaptation[]
  matchScore: number
  adaptedAt: Date
}

export interface CVAdaptation {
  section: CVSection
  field: string
  originalValue: string
  adaptedValue: string
  reason: string
  confidence: number
}

export enum CVSection {
  PERSONAL_INFO = 'personalInfo',
  WORK_EXPERIENCE = 'workExperience',
  EDUCATION = 'education',
  SKILLS = 'skills',
  PROJECTS = 'projects',
  CERTIFICATIONS = 'certifications',
  LANGUAGES = 'languages',
  SUMMARY = 'summary'
}