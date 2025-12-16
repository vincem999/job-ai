// API Request/Response Type Definitions

import type { CV, AdaptedCV } from './cv'
import type { JobAnalysis } from './job-analysis'

// Base API Response Structure
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: ApiError
  timestamp: Date
  processingTime?: number
  version?: string
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
  statusCode: number
  timestamp: Date
  requestId?: string
}

// Pagination
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Job Analysis API
export interface AnalyzeJobRequest {
  jobOffer: {
    title: string
    company: string
    description: string
    requirements?: string[]
    responsibilities?: string[]
    location?: string
    salaryRange?: {
      min?: number
      max?: number
      currency: string
    }
    employmentType?: string
    experienceLevel?: string
  }
  options?: {
    includeSkillGaps?: boolean
    includeLearningResources?: boolean
    detailLevel?: 'basic' | 'detailed' | 'comprehensive'
    focusAreas?: string[]
  }
}

export interface AnalyzeJobResponse extends ApiResponse<JobAnalysis> {
  data: JobAnalysis
}

// CV Adaptation API
export interface AdaptCVRequest {
  jobAnalysisId: string
  cvId?: string
  masterCV?: CV
  adaptationOptions?: {
    sections?: string[]
    preserveOriginal?: boolean
    emphasizeStrengths?: boolean
    addressWeaknesses?: boolean
    customInstructions?: string
  }
}

export interface AdaptCVResponse extends ApiResponse<AdaptedCV> {
  data: AdaptedCV
}

// Cover Letter Generation API
export interface GenerateLetterRequest {
  jobAnalysisId: string
  adaptedCVId?: string
  letterOptions?: {
    tone?: LetterTone
    length?: LetterLength
    focusAreas?: string[]
    customIntroduction?: string
    customClosing?: string
    includeSpecificExperiences?: string[]
    emphasizeSkills?: string[]
  }
  companyResearch?: {
    companyInfo?: string
    recentNews?: string[]
    culture?: string
    values?: string[]
  }
}

export enum LetterTone {
  PROFESSIONAL = 'professional',
  ENTHUSIASTIC = 'enthusiastic',
  CONFIDENT = 'confident',
  FORMAL = 'formal',
  CONVERSATIONAL = 'conversational'
}

export enum LetterLength {
  SHORT = 'short',
  MEDIUM = 'medium',
  LONG = 'long'
}

export interface CoverLetter {
  id: string
  jobAnalysisId: string
  adaptedCVId?: string
  content: string
  structure: LetterStructure
  tone: LetterTone
  length: LetterLength
  keyPoints: string[]
  generatedAt: Date
  version: string
}

export interface LetterStructure {
  header: LetterSection
  introduction: LetterSection
  body: LetterSection[]
  closing: LetterSection
  signature: LetterSection
}

export interface LetterSection {
  type: string
  content: string
  emphasis?: string[]
  keywords?: string[]
}

export interface GenerateLetterResponse extends ApiResponse<CoverLetter> {
  data: CoverLetter
}

// CV Management API
export interface CreateCVRequest {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    address?: {
      city: string
      country: string
      street?: string
      zipCode?: string
    }
    linkedin?: string
    github?: string
    website?: string
    summary?: string
  }
  workExperiences?: any[]
  education?: any[]
  skills?: any[]
  projects?: any[]
  certifications?: any[]
  languages?: any[]
}

export interface CreateCVResponse extends ApiResponse<CV> {
  data: CV
}

export interface UpdateCVRequest {
  cvId: string
  updates: Partial<CV>
}

export interface UpdateCVResponse extends ApiResponse<CV> {
  data: CV
}

export interface GetCVResponse extends ApiResponse<CV> {
  data: CV
}

export interface ListCVsResponse extends PaginatedResponse<CV> {
  data: CV[]
}

// Document Export API
export interface ExportDocumentRequest {
  documentId: string
  documentType: 'cv' | 'letter'
  format: ExportFormat
  options?: ExportOptions
}

export enum ExportFormat {
  PDF = 'pdf',
  DOCX = 'docx',
  HTML = 'html',
  TXT = 'txt'
}

export interface ExportOptions {
  template?: string
  styling?: {
    fontSize?: number
    fontFamily?: string
    margins?: {
      top: number
      right: number
      bottom: number
      left: number
    }
    colors?: {
      primary?: string
      secondary?: string
      text?: string
    }
  }
  includeMetadata?: boolean
  watermark?: string
}

export interface ExportDocumentResponse extends ApiResponse<ExportResult> {
  data: ExportResult
}

export interface ExportResult {
  downloadUrl: string
  filename: string
  format: ExportFormat
  size: number
  expiresAt: Date
  metadata?: {
    pages?: number
    wordCount?: number
    generatedAt: Date
  }
}

// Health Check API
export interface HealthCheckResponse extends ApiResponse<HealthStatus> {
  data: HealthStatus
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: Date
  uptime: number
  version: string
  services: ServiceStatus[]
  metrics?: {
    requestsPerMinute: number
    averageResponseTime: number
    errorRate: number
  }
}

export interface ServiceStatus {
  name: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  lastCheck: Date
  responseTime?: number
  error?: string
}

// Search and Filter Types
export interface SearchRequest {
  query?: string
  filters?: {
    dateRange?: {
      from: Date
      to: Date
    }
    type?: string[]
    status?: string[]
    tags?: string[]
  }
  sort?: {
    field: string
    direction: 'asc' | 'desc'
  }
  pagination?: {
    page: number
    limit: number
  }
}

// WebSocket API Types
export interface WebSocketMessage {
  type: string
  payload: any
  timestamp: Date
  requestId?: string
}

export interface ProgressUpdate extends WebSocketMessage {
  type: 'progress'
  payload: {
    stage: string
    progress: number
    message: string
    estimatedTimeRemaining?: number
  }
}

export interface ErrorUpdate extends WebSocketMessage {
  type: 'error'
  payload: {
    error: ApiError
    recoverable: boolean
  }
}

export interface CompletionUpdate extends WebSocketMessage {
  type: 'completion'
  payload: {
    result: any
    processingTime: number
  }
}

// Rate Limiting
export interface RateLimitInfo {
  limit: number
  remaining: number
  reset: Date
  retryAfter?: number
}

export interface RateLimitResponse extends ApiResponse<null> {
  rateLimit: RateLimitInfo
}

// Authentication (if needed in the future)
export interface AuthRequest {
  email: string
  password: string
}

export interface AuthResponse extends ApiResponse<AuthResult> {
  data: AuthResult
}

export interface AuthResult {
  token: string
  refreshToken: string
  expiresAt: Date
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
  }
}

// Validation Error Response
export interface ValidationError extends ApiError {
  code: 'VALIDATION_ERROR'
  details: {
    field: string
    message: string
    value?: any
  }[]
}