// Job Analysis Type Definitions

export interface JobOffer {
  id: string
  title: string
  company: string
  location?: string
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits?: string[]
  salaryRange?: SalaryRange
  employmentType: EmploymentType
  experienceLevel: ExperienceLevel
  postedDate: Date
  applicationDeadline?: Date
  url?: string
  source: string
  companyInfo?: CompanyInfo
}

export interface SalaryRange {
  min?: number
  max?: number
  currency: string
  period: SalaryPeriod
}

export enum SalaryPeriod {
  HOURLY = 'hourly',
  DAILY = 'daily',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export enum EmploymentType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship',
  TEMPORARY = 'temporary'
}

export enum ExperienceLevel {
  ENTRY = 'entry',
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
  EXECUTIVE = 'executive'
}

export interface CompanyInfo {
  name: string
  industry?: string
  size?: CompanySize
  description?: string
  website?: string
  location?: string
  culture?: string[]
}

export enum CompanySize {
  STARTUP = 'startup',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  ENTERPRISE = 'enterprise'
}

export interface JobAnalysis {
  id: string
  jobOfferId: string
  analyzedAt: Date

  // Core analysis results
  extractedSkills: ExtractedSkill[]
  keyRequirements: Requirement[]
  responsibilities: ResponsibilityAnalysis[]

  // Matching and scoring
  skillsMatch: SkillsMatchAnalysis
  experienceMatch: ExperienceMatchAnalysis
  educationMatch: EducationMatchAnalysis

  // Overall scores
  overallMatchScore: number
  confidenceScore: number

  // Recommendations
  recommendations: JobRecommendation[]
  missingSkills: MissingSkill[]
  strengthAreas: StrengthArea[]

  // Insights
  competitiveAdvantages: string[]
  potentialChallenges: string[]
  careerGrowthOpportunities: string[]

  // Analysis metadata
  analysisVersion: string
  modelUsed: string
  processingTimeMs: number
}

export interface ExtractedSkill {
  name: string
  category: string
  importance: ImportanceLevel
  isRequired: boolean
  mentions: number
  context: string[]
  synonyms: string[]
  relatedSkills: string[]
}

export enum ImportanceLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface Requirement {
  id: string
  type: RequirementType
  description: string
  importance: ImportanceLevel
  isFlexible: boolean
  alternatives?: string[]
}

export enum RequirementType {
  SKILL = 'skill',
  EXPERIENCE = 'experience',
  EDUCATION = 'education',
  CERTIFICATION = 'certification',
  LANGUAGE = 'language',
  LOCATION = 'location',
  OTHER = 'other'
}

export interface ResponsibilityAnalysis {
  description: string
  category: ResponsibilityCategory
  skillsRequired: string[]
  complexityLevel: number
  timeAllocation?: number
}

export enum ResponsibilityCategory {
  TECHNICAL = 'technical',
  MANAGEMENT = 'management',
  COMMUNICATION = 'communication',
  ANALYSIS = 'analysis',
  CREATIVE = 'creative',
  ADMINISTRATIVE = 'administrative',
  STRATEGIC = 'strategic'
}

export interface SkillsMatchAnalysis {
  totalRequiredSkills: number
  matchedSkills: number
  matchPercentage: number
  skillGaps: SkillGap[]
  skillSurplus: SkillSurplus[]
  categoryBreakdown: SkillCategoryMatch[]
}

export interface SkillGap {
  skill: string
  importance: ImportanceLevel
  alternatives: string[]
  learningDifficulty: LearningDifficulty
  estimatedLearningTime: string
  resources: LearningResource[]
}

export interface SkillSurplus {
  skill: string
  relevance: number
  transferableValue: number
  description: string
}

export interface SkillCategoryMatch {
  category: string
  required: number
  matched: number
  percentage: number
}

export enum LearningDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  VERY_HARD = 'very_hard'
}

export interface LearningResource {
  type: ResourceType
  title: string
  url?: string
  estimatedTime: string
  cost?: string
  rating?: number
}

export enum ResourceType {
  COURSE = 'course',
  BOOK = 'book',
  TUTORIAL = 'tutorial',
  CERTIFICATION = 'certification',
  PRACTICE = 'practice',
  DOCUMENTATION = 'documentation'
}

export interface ExperienceMatchAnalysis {
  requiredYears: number
  candidateYears: number
  matchLevel: MatchLevel
  relevantExperience: RelevantExperience[]
  experienceGaps: ExperienceGap[]
}

export interface EducationMatchAnalysis {
  requirementsMet: boolean
  degreeMatch: DegreeMatch
  fieldMatch: FieldMatch
  alternativeQualifications: string[]
}

export enum MatchLevel {
  POOR = 'poor',
  FAIR = 'fair',
  GOOD = 'good',
  EXCELLENT = 'excellent'
}

export interface RelevantExperience {
  position: string
  company: string
  relevanceScore: number
  applicableSkills: string[]
  duration: string
}

export interface ExperienceGap {
  area: string
  importance: ImportanceLevel
  suggestedExperience: string[]
}

export interface DegreeMatch {
  required: string[]
  candidate: string[]
  matchLevel: MatchLevel
  isAcceptable: boolean
}

export interface FieldMatch {
  required: string[]
  candidate: string[]
  matchLevel: MatchLevel
  transferableKnowledge: string[]
}

export interface JobRecommendation {
  type: RecommendationType
  title: string
  description: string
  priority: ImportanceLevel
  actionItems: string[]
  expectedImpact: string
  timeToImplement: string
}

export enum RecommendationType {
  SKILL_DEVELOPMENT = 'skill_development',
  EXPERIENCE_HIGHLIGHTING = 'experience_highlighting',
  EDUCATION_EMPHASIS = 'education_emphasis',
  CV_RESTRUCTURE = 'cv_restructure',
  COVER_LETTER_FOCUS = 'cover_letter_focus',
  NETWORKING = 'networking',
  CERTIFICATION = 'certification'
}

export interface MissingSkill {
  name: string
  importance: ImportanceLevel
  category: string
  canLearn: boolean
  timeToLearn: string
  difficulty: LearningDifficulty
  alternatives: string[]
}

export interface StrengthArea {
  skill: string
  proficiencyLevel: string
  competitiveAdvantage: string
  howToEmphasize: string[]
}

// Analysis request and response types
export interface JobAnalysisRequest {
  jobOffer: JobOffer
  candidateCV?: string
  options?: AnalysisOptions
}

export interface AnalysisOptions {
  includeSkillGaps: boolean
  includeLearningResources: boolean
  includeCompetitorAnalysis: boolean
  detailLevel: DetailLevel
  focusAreas?: string[]
}

export enum DetailLevel {
  BASIC = 'basic',
  DETAILED = 'detailed',
  COMPREHENSIVE = 'comprehensive'
}

export interface JobAnalysisResponse {
  success: boolean
  data?: JobAnalysis
  error?: AnalysisError
  processingTime: number
  timestamp: Date
}

export interface AnalysisError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: Date
}