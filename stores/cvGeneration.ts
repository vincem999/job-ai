import { defineStore } from 'pinia'
import type { CV, AdaptedCV, CVAdaptation } from '~/types/cv'
import type { JobAnalysis } from '~/types/job-analysis'

export interface GenerationStep {
  id: string
  name: string
  status: 'pending' | 'in_progress' | 'completed' | 'error'
  progress: number
  startTime?: Date
  endTime?: Date
  error?: string
}

export interface CVGenerationState {
  // Master CV
  masterCV: CV | null

  // Current generation workflow
  currentAdaptedCV: AdaptedCV | null
  currentJobAnalysis: JobAnalysis | null

  // Generation process
  isGenerating: boolean
  generationSteps: GenerationStep[]
  currentStepIndex: number
  overallProgress: number

  // Generated content
  generatedCoverLetter: string | null
  generationTimestamp: Date | null

  // History
  generationHistory: AdaptedCV[]

  // Settings
  generationOptions: {
    includeAllExperiences: boolean
    emphasizeKeywords: boolean
    optimizeForATS: boolean
    includePersonalProjects: boolean
    maxExperiences: number
  }

  // Error handling
  error: string | null
  lastError: string | null
}

export const useCVGenerationStore = defineStore('cvGeneration', {
  state: (): CVGenerationState => ({
    masterCV: null,

    currentAdaptedCV: null,
    currentJobAnalysis: null,

    isGenerating: false,
    generationSteps: [],
    currentStepIndex: 0,
    overallProgress: 0,

    generatedCoverLetter: null,
    generationTimestamp: null,

    generationHistory: [],

    generationOptions: {
      includeAllExperiences: false,
      emphasizeKeywords: true,
      optimizeForATS: true,
      includePersonalProjects: true,
      maxExperiences: 4
    },

    error: null,
    lastError: null
  }),

  getters: {
    canStartGeneration: (state) =>
      !state.isGenerating &&
      state.masterCV !== null &&
      state.currentJobAnalysis !== null,

    hasGeneratedContent: (state) =>
      state.currentAdaptedCV !== null ||
      state.generatedCoverLetter !== null,

    isProcessing: (state) => state.isGenerating,

    currentStep: (state) =>
      state.generationSteps[state.currentStepIndex] || null,

    hasError: (state) => state.error !== null,

    generationHistoryCount: (state) => state.generationHistory.length,

    latestGeneration: (state) =>
      state.generationHistory.length > 0
        ? state.generationHistory[state.generationHistory.length - 1]
        : null,

    totalAdaptations: (state) =>
      state.currentAdaptedCV?.adaptations.length || 0,

    adaptationsBySection: (state) => {
      if (!state.currentAdaptedCV) return {}

      return state.currentAdaptedCV.adaptations.reduce((acc, adaptation) => {
        const section = adaptation.section
        if (!acc[section]) acc[section] = []
        acc[section].push(adaptation)
        return acc
      }, {} as Record<string, CVAdaptation[]>)
    }
  },

  actions: {
    // Initialize generation process
    async generateDocuments(jobAnalysis: JobAnalysis) {
      if (!this.canStartGeneration) {
        throw new Error('Cannot start generation: missing master CV or job analysis')
      }

      this.clearError()
      this.currentJobAnalysis = jobAnalysis
      this.isGenerating = true
      this.overallProgress = 0
      this.currentStepIndex = 0
      this.generationTimestamp = new Date()

      this.initializeGenerationSteps()

      try {
        // Step 1: Adapt CV
        await this.adaptCV(jobAnalysis)

        // Step 2: Generate cover letter
        await this.generateCoverLetter(jobAnalysis)

        // Step 3: Finalize
        this.finalizeGeneration()

      } catch (error) {
        this.setError(error as Error)
        throw error
      } finally {
        this.isGenerating = false
      }
    },

    // Initialize generation steps
    initializeGenerationSteps() {
      this.generationSteps = [
        {
          id: 'load_master_cv',
          name: 'Chargement du CV maître',
          status: 'pending',
          progress: 0
        },
        {
          id: 'analyze_requirements',
          name: 'Analyse des exigences',
          status: 'pending',
          progress: 0
        },
        {
          id: 'adapt_summary',
          name: 'Adaptation du résumé',
          status: 'pending',
          progress: 0
        },
        {
          id: 'select_experiences',
          name: 'Sélection des expériences',
          status: 'pending',
          progress: 0
        },
        {
          id: 'optimize_skills',
          name: 'Optimisation des compétences',
          status: 'pending',
          progress: 0
        },
        {
          id: 'generate_letter',
          name: 'Génération de la lettre',
          status: 'pending',
          progress: 0
        },
        {
          id: 'finalize',
          name: 'Finalisation',
          status: 'pending',
          progress: 0
        }
      ]
    },

    // Adapt CV based on job analysis
    async adaptCV(jobAnalysis: JobAnalysis) {
      await this.executeStep('load_master_cv', async () => {
        if (!this.masterCV) {
          await this.loadMasterCV()
        }
      })

      await this.executeStep('analyze_requirements', async () => {
        // Process job requirements for CV adaptation
        await this.delay(500) // Simulate processing
      })

      await this.executeStep('adapt_summary', async () => {
        // Adapt personal summary/objective
        await this.adaptPersonalSummary(jobAnalysis)
      })

      await this.executeStep('select_experiences', async () => {
        // Select and prioritize relevant experiences
        await this.selectRelevantExperiences(jobAnalysis)
      })

      await this.executeStep('optimize_skills', async () => {
        // Optimize skills section based on job requirements
        await this.optimizeSkillsSection(jobAnalysis)
      })

      // Call API to get adapted CV
      const response = await $fetch<{ success: boolean; data?: AdaptedCV; error?: string }>('/api/adapt-cv', {
        method: 'POST',
        body: {
          masterCV: this.masterCV,
          jobAnalysis: jobAnalysis,
          options: this.generationOptions
        }
      })

      if (response.success && response.data) {
        this.currentAdaptedCV = response.data
        this.addToHistory(response.data)
      } else {
        throw new Error(response.error || 'CV adaptation failed')
      }
    },

    // Generate cover letter
    async generateCoverLetter(jobAnalysis: JobAnalysis) {
      await this.executeStep('generate_letter', async () => {
        const response = await $fetch<{ success: boolean; data?: string; error?: string }>('/api/generate-letter', {
          method: 'POST',
          body: {
            adaptedCV: this.currentAdaptedCV,
            jobAnalysis: jobAnalysis
          }
        })

        if (response.success && response.data) {
          this.generatedCoverLetter = response.data
        } else {
          throw new Error(response.error || 'Cover letter generation failed')
        }
      })
    },

    // Execute a generation step
    async executeStep(stepId: string, action: () => Promise<void>) {
      const step = this.generationSteps.find(s => s.id === stepId)
      if (!step) return

      step.status = 'in_progress'
      step.startTime = new Date()

      try {
        await action()
        step.status = 'completed'
        step.progress = 100
        step.endTime = new Date()

        this.currentStepIndex++
        this.updateOverallProgress()

      } catch (error) {
        step.status = 'error'
        step.error = (error as Error).message
        step.endTime = new Date()
        throw error
      }
    },

    // Load master CV
    async loadMasterCV() {
      // This would typically load from the server or local storage
      // For now, we'll simulate loading
      await this.delay(300)

      if (!this.masterCV) {
        throw new Error('Master CV not found')
      }
    },

    // Adapt personal summary
    async adaptPersonalSummary(_jobAnalysis: JobAnalysis) {
      await this.delay(800)
      // Implementation would adapt the summary based on job requirements
    },

    // Select relevant experiences
    async selectRelevantExperiences(_jobAnalysis: JobAnalysis) {
      await this.delay(1000)
      // Implementation would select and rank experiences based on relevance
    },

    // Optimize skills section
    async optimizeSkillsSection(_jobAnalysis: JobAnalysis) {
      await this.delay(600)
      // Implementation would reorder and emphasize relevant skills
    },

    // Finalize generation
    finalizeGeneration() {
      this.executeStep('finalize', async () => {
        await this.delay(200)
        // Any final processing or validation
      })
    },

    // Update overall progress
    updateOverallProgress() {
      const totalSteps = this.generationSteps.length
      const completedSteps = this.generationSteps.filter(s => s.status === 'completed').length
      this.overallProgress = Math.round((completedSteps / totalSteps) * 100)
    },

    // Add to generation history
    addToHistory(adaptedCV: AdaptedCV) {
      this.generationHistory.push(adaptedCV)

      // Keep history limited to last 20 generations
      if (this.generationHistory.length > 20) {
        this.generationHistory = this.generationHistory.slice(-20)
      }
    },

    // Set master CV
    setMasterCV(cv: CV) {
      this.masterCV = cv
    },

    // Update generation options
    updateGenerationOptions(options: Partial<CVGenerationState['generationOptions']>) {
      this.generationOptions = { ...this.generationOptions, ...options }
    },

    // Error handling
    setError(error: Error) {
      this.error = error.message
      this.lastError = error.message

      // Mark current step as error
      const currentStep = this.generationSteps[this.currentStepIndex]
      if (currentStep) {
        currentStep.status = 'error'
        currentStep.error = error.message
        currentStep.endTime = new Date()
      }
    },

    clearError() {
      this.error = null
    },

    // Reset generation state
    reset() {
      this.currentAdaptedCV = null
      this.currentJobAnalysis = null
      this.isGenerating = false
      this.generationSteps = []
      this.currentStepIndex = 0
      this.overallProgress = 0
      this.generatedCoverLetter = null
      this.generationTimestamp = null
      this.error = null
    },

    // Clear history
    clearHistory() {
      this.generationHistory = []
    },

    // Get generation by ID
    getGenerationById(id: string): AdaptedCV | null {
      return this.generationHistory.find(cv => cv.id === id) || null
    },

    // Remove generation from history
    removeGenerationFromHistory(id: string) {
      this.generationHistory = this.generationHistory.filter(cv => cv.id !== id)
    },

    // Utility: delay function
    delay(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
  }
})