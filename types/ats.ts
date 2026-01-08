// ATS (Applicant Tracking System) Type Definitions

export interface ATSOptimization {
  score: number; // 0-100
  adaptationNeeded: boolean;
  keywords: {
    matched: string[];
    missing: string[];
    recommended: string[];
    priority: string[];
  };
  suggestions: string[];
}

export interface ATSKeywords {
  matched: string[];
  missing: string[];
  recommended: string[];
  priority: string[];
}

// Extended JobAnalysisResponse with ATS data
export interface JobAnalysisResponse {
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  requirements: string[];
  experienceLevel?: 'Entry' | 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Executive';
  industryKeywords: string[];
  atsOptimization?: ATSOptimization;
}

export interface JobAnalysisRequest {
  jobOffer: string;
  company?: string;
  position?: string;
  additionalContext?: string;
  cvData?: any; // CV data for ATS optimization
}