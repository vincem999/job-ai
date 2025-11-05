import { defineStore } from 'pinia'
import type { JobAnalysis, JobAnalysisResponse, AnalysisError } from '~/types/job-analysis'

export interface JobAnalysisState {
  // Current job analysis workflow
  currentAnalysis: JobAnalysis | null
  currentJobOfferText: string

  // Loading states
  isAnalyzing: boolean
  isLoading: boolean

  // Error handling
  error: AnalysisError | null
  lastError: AnalysisError | null

  // History and cache
  analysisHistory: JobAnalysis[]
  cachedAnalyses: Map<string, JobAnalysis>

  // Workflow progress
  analysisProgress: number // 0-100
  currentStep: AnalysisStep

  // Settings
  analysisOptions: {
    includeSkillGaps: boolean
    includeLearningResources: boolean
    includeCompetitorAnalysis: boolean
    detailLevel: 'basic' | 'detailed' | 'comprehensive'
  }
}

export enum AnalysisStep {
  IDLE = 'idle',
  EXTRACTING_TEXT = 'extracting_text',
  ANALYZING_SKILLS = 'analyzing_skills',
  MATCHING_REQUIREMENTS = 'matching_requirements',
  GENERATING_RECOMMENDATIONS = 'generating_recommendations',
  COMPLETED = 'completed',
  ERROR = 'error'
}

export const useJobAnalysisStore = defineStore('jobAnalysis', {
  state: (): JobAnalysisState => ({
    currentAnalysis: null,
    currentJobOfferText: '',

    isAnalyzing: false,
    isLoading: false,

    error: null,
    lastError: null,

    analysisHistory: [],
    cachedAnalyses: new Map(),

    analysisProgress: 0,
    currentStep: AnalysisStep.IDLE,

    analysisOptions: {
      includeSkillGaps: true,
      includeLearningResources: true,
      includeCompetitorAnalysis: false,
      detailLevel: 'detailed'
    }
  }),

  getters: {
    hasCurrentAnalysis: (state) => state.currentAnalysis !== null,

    hasError: (state) => state.error !== null,

    isProcessing: (state) => state.isAnalyzing || state.isLoading,

    canStartAnalysis: (state) =>
      !state.isAnalyzing &&
      state.currentJobOfferText.trim().length > 100,

    currentStepLabel: (state) => {
      const labels: Record<AnalysisStep, string> = {
        [AnalysisStep.IDLE]: 'En attente',
        [AnalysisStep.EXTRACTING_TEXT]: 'Extraction du texte',
        [AnalysisStep.ANALYZING_SKILLS]: 'Analyse des compétences',
        [AnalysisStep.MATCHING_REQUIREMENTS]: 'Correspondance des exigences',
        [AnalysisStep.GENERATING_RECOMMENDATIONS]: 'Génération des recommandations',
        [AnalysisStep.COMPLETED]: 'Terminé',
        [AnalysisStep.ERROR]: 'Erreur'
      }
      return labels[state.currentStep]
    },

    analysisHistoryCount: (state) => state.analysisHistory.length,

    lastAnalysis: (state) =>
      state.analysisHistory.length > 0
        ? state.analysisHistory[state.analysisHistory.length - 1]
        : null
  },

  actions: {
    // Start job analysis
    async analyzeJobOffer(jobOfferText: string) {
      if (!this.canStartAnalysis) {
        throw new Error('Cannot start analysis: invalid state or text too short')
      }

      this.clearError()
      this.currentJobOfferText = jobOfferText
      this.isAnalyzing = true
      this.analysisProgress = 0
      this.currentStep = AnalysisStep.EXTRACTING_TEXT

      try {
        // Check cache first
        const cacheKey = this.generateCacheKey(jobOfferText)
        const cachedAnalysis = this.cachedAnalyses.get(cacheKey)

        if (cachedAnalysis) {
          this.setAnalysisFromCache(cachedAnalysis)
          return cachedAnalysis
        }

        // Call API for analysis
        const response = await this.callAnalysisAPI(jobOfferText)

        if (response.success && response.data) {
          this.setAnalysisResult(response.data)
          this.cacheAnalysis(cacheKey, response.data)
          return response.data
        } else {
          throw new Error(response.error?.message || 'Analysis failed')
        }
      } catch (error) {
        this.setError(error as Error)
        throw error
      } finally {
        this.isAnalyzing = false
      }
    },

    // Call the analysis API
    async callAnalysisAPI(jobOfferText: string): Promise<JobAnalysisResponse> {
      this.updateProgress(AnalysisStep.ANALYZING_SKILLS, 25)

      const response = await $fetch<JobAnalysisResponse>('/api/analyze-job', {
        method: 'POST',
        body: {
          jobOfferText,
          options: this.analysisOptions
        }
      })

      this.updateProgress(AnalysisStep.MATCHING_REQUIREMENTS, 50)

      // Simulate progress updates for better UX
      await this.simulateProgress(AnalysisStep.GENERATING_RECOMMENDATIONS, 75)

      return response
    },

    // Set analysis result
    setAnalysisResult(analysis: JobAnalysis) {
      this.currentAnalysis = analysis
      this.analysisHistory.push(analysis)
      this.updateProgress(AnalysisStep.COMPLETED, 100)

      // Keep history limited to last 10 analyses
      if (this.analysisHistory.length > 10) {
        this.analysisHistory = this.analysisHistory.slice(-10)
      }
    },

    // Set analysis from cache
    setAnalysisFromCache(analysis: JobAnalysis) {
      this.currentAnalysis = analysis
      this.updateProgress(AnalysisStep.COMPLETED, 100)
    },

    // Cache analysis result
    cacheAnalysis(key: string, analysis: JobAnalysis) {
      this.cachedAnalyses.set(key, analysis)

      // Keep cache limited to 50 entries
      if (this.cachedAnalyses.size > 50) {
        const firstKey = this.cachedAnalyses.keys().next().value
        this.cachedAnalyses.delete(firstKey)
      }
    },

    // Update progress
    updateProgress(step: AnalysisStep, progress: number) {
      this.currentStep = step
      this.analysisProgress = progress
    },

    // Simulate progress for better UX
    async simulateProgress(step: AnalysisStep, targetProgress: number) {
      this.currentStep = step
      const currentProgress = this.analysisProgress
      const increment = (targetProgress - currentProgress) / 10

      for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 100))
        this.analysisProgress = Math.min(targetProgress, currentProgress + increment * (i + 1))
      }
    },

    // Error handling
    setError(error: Error) {
      const analysisError: AnalysisError = {
        code: 'ANALYSIS_ERROR',
        message: error.message,
        timestamp: new Date(),
        details: { originalError: error }
      }

      this.error = analysisError
      this.lastError = analysisError
      this.currentStep = AnalysisStep.ERROR
    },

    clearError() {
      this.error = null
    },

    // Utility methods
    generateCacheKey(jobOfferText: string): string {
      // Simple hash function for caching
      let hash = 0
      for (let i = 0; i < jobOfferText.length; i++) {
        const char = jobOfferText.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32-bit integer
      }
      return `job_${Math.abs(hash)}_${this.analysisOptions.detailLevel}`
    },

    // Reset store
    reset() {
      this.currentAnalysis = null
      this.currentJobOfferText = ''
      this.isAnalyzing = false
      this.isLoading = false
      this.error = null
      this.analysisProgress = 0
      this.currentStep = AnalysisStep.IDLE
    },

    // Clear history
    clearHistory() {
      this.analysisHistory = []
    },

    // Clear cache
    clearCache() {
      this.cachedAnalyses.clear()
    },

    // Update analysis options
    updateAnalysisOptions(options: Partial<JobAnalysisState['analysisOptions']>) {
      this.analysisOptions = { ...this.analysisOptions, ...options }
    },

    // Get analysis by ID
    getAnalysisById(id: string): JobAnalysis | null {
      return this.analysisHistory.find(analysis => analysis.id === id) || null
    },

    // Remove analysis from history
    removeAnalysisFromHistory(id: string) {
      this.analysisHistory = this.analysisHistory.filter(analysis => analysis.id !== id)
    }
  }
})