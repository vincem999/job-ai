// CV Data Type Definitions

export interface PersonalInfo {
  firstName: string
  lastName: string
  title: string
  email: string
  phone: string
  location: string
  linkedin?: string
  github?: string
  photo?: string
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
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  description: string
  bullets: string[]
  skills: string[]
}

export interface Education {
  id: string
  degree: string
  institution: string
  year: string
  location?: string
  details?: string
  description?: string
}

export interface Skills {
  technical: string[]
  languages: string[]
  soft: string[]
}

export enum SkillCategory {
  TECHNICAL = "technical",
  SOFT = "soft",
  LANGUAGE = "language",
  CERTIFICATION = "certification",
  TOOL = "tool",
  FRAMEWORK = "framework",
}

export enum SkillLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
  EXPERT = "expert",
}

export interface Project {
  id?: string
  name: string
  description?: string
  technologies?: string[]
  url?: string
  date?: string
}

export interface Certification {
  id?: string
  name: string
  issuer: string
  date?: string
}

export interface Language {
  id: string
  name: string
  level: LanguageLevel
  certifications?: string[]
}

export enum LanguageLevel {
  BASIC = "basic",
  CONVERSATIONAL = "conversational",
  FLUENT = "fluent",
  NATIVE = "native",
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
  summary: string
  workExperiences: WorkExperience[]
  education: Education[]
  skills: Skills
  certifications?: Certification[]
  projects?: Project[]
  languages?: Language[]
  references?: Reference[]
  createdAt?: Date
  updatedAt?: Date
  version?: string
  isTemplate?: boolean
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
  PERSONAL_INFO = "personalInfo",
  WORK_EXPERIENCE = "workExperience",
  EDUCATION = "education",
  SKILLS = "skills",
  PROJECTS = "projects",
  CERTIFICATIONS = "certifications",
  LANGUAGES = "languages",
  SUMMARY = "summary",
}
