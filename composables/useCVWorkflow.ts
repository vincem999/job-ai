/**
 * Composable principal qui orchestre le workflow complet de génération de CV
 * Utilise tous les stores Pinia pour coordonner les étapes
 */
import { useJobAnalysisStore } from '~/stores/jobAnalysis'
import { useCVGenerationStore } from '~/stores/cvGeneration'
import { useErrorHandlerStore } from '~/stores/errorHandler'
import { useDocumentExportStore } from '~/stores/documentExport'

export const useCVWorkflow = () => {
  // Stores
  const jobAnalysisStore = useJobAnalysisStore()
  const cvGenerationStore = useCVGenerationStore()
  const errorHandlerStore = useErrorHandlerStore()
  const documentExportStore = useDocumentExportStore()

  // Computed states
  const isProcessing = computed(() =>
    jobAnalysisStore.isProcessing ||
    cvGenerationStore.isProcessing ||
    documentExportStore.isProcessing
  )

  const hasError = computed(() =>
    jobAnalysisStore.hasError ||
    cvGenerationStore.hasError ||
    errorHandlerStore.hasErrors
  )

  const canStartWorkflow = computed(() =>
    jobAnalysisStore.canStartAnalysis &&
    !isProcessing.value
  )

  const workflowProgress = computed(() => {
    // Calculate overall progress across all steps
    let totalProgress = 0
    let _stepCount = 0

    // Job Analysis (25% of total)
    if (jobAnalysisStore.currentAnalysis) {
      totalProgress += 25
    } else if (jobAnalysisStore.isAnalyzing) {
      totalProgress += (jobAnalysisStore.analysisProgress * 0.25)
    }
    _stepCount++

    // CV Generation (50% of total)
    if (cvGenerationStore.currentAdaptedCV) {
      totalProgress += 50
    } else if (cvGenerationStore.isGenerating) {
      totalProgress += (cvGenerationStore.overallProgress * 0.5)
    }
    _stepCount++

    // Document Export (25% of total)
    if (documentExportStore.currentExport?.status === 'completed') {
      totalProgress += 25
    } else if (documentExportStore.isProcessing) {
      const currentJob = documentExportStore.currentExport
      if (currentJob) {
        totalProgress += (currentJob.progress * 0.25)
      }
    }
    // stepCount is used for tracking step progression internally
    _stepCount++

    return Math.round(totalProgress)
  })

  const currentStep = computed(() => {
    if (jobAnalysisStore.isAnalyzing) {
      return {
        name: 'Analyse de l\'offre d\'emploi',
        description: jobAnalysisStore.currentStepLabel,
        progress: jobAnalysisStore.analysisProgress
      }
    }

    if (cvGenerationStore.isGenerating) {
      const currentStep = cvGenerationStore.currentStep
      return {
        name: 'Génération du CV',
        description: currentStep?.name || 'En cours...',
        progress: cvGenerationStore.overallProgress
      }
    }

    if (documentExportStore.isProcessing) {
      const currentJob = documentExportStore.currentExport
      return {
        name: 'Export des documents',
        description: `Génération de ${currentJob?.filename}`,
        progress: currentJob?.progress || 0
      }
    }

    return {
      name: 'En attente',
      description: 'Prêt à commencer',
      progress: 0
    }
  })

  // Main workflow methods
  const startCompleteWorkflow = async (jobOfferText: string) => {
    try {
      // Clear any previous errors
      errorHandlerStore.clearError()

      // Step 1: Analyze job offer
      const analysis = await jobAnalysisStore.analyzeJobOffer(jobOfferText)

      // Step 2: Generate adapted CV and cover letter
      const adaptedCV = await cvGenerationStore.generateDocuments(analysis)

      // Step 3: Export documents
      const [cvExport, letterExport] = await Promise.all([
        documentExportStore.exportCV(adaptedCV, `cv_${Date.now()}.pdf`),
        documentExportStore.exportCoverLetter(
          cvGenerationStore.generatedCoverLetter,
          `cover_letter_${Date.now()}.pdf`
        )
      ])

      return {
        analysis,
        adaptedCV,
        coverLetter: cvGenerationStore.generatedCoverLetter,
        exports: { cv: cvExport, letter: letterExport }
      }

    } catch (error) {
      // Handle error through error store
      errorHandlerStore.handleError(
        error as Error,
        'api', // ErrorType.API
        'high', // ErrorSeverity.HIGH
        {
          component: 'CVWorkflow',
          action: 'startCompleteWorkflow'
        }
      )
      throw error
    }
  }

  // Individual step methods
  const analyzeJobOffer = async (jobOfferText: string) => {
    try {
      return await jobAnalysisStore.analyzeJobOffer(jobOfferText)
    } catch (error) {
      errorHandlerStore.handleAPIError(error as Error, {
        component: 'CVWorkflow',
        action: 'analyzeJobOffer'
      })
      throw error
    }
  }

  const generateCV = async (analysis?: any) => {
    try {
      const jobAnalysis = analysis || jobAnalysisStore.currentAnalysis
      if (!jobAnalysis) {
        throw new Error('No job analysis available for CV generation')
      }

      return await cvGenerationStore.generateDocuments(jobAnalysis)
    } catch (error) {
      errorHandlerStore.handleAPIError(error as Error, {
        component: 'CVWorkflow',
        action: 'generateCV'
      })
      throw error
    }
  }

  const exportDocuments = async (options?: { format?: 'pdf' | 'docx'; combined?: boolean }) => {
    try {
      const { format = 'pdf', combined = false } = options || {}

      if (!cvGenerationStore.currentAdaptedCV) {
        throw new Error('No adapted CV available for export')
      }

      if (combined) {
        return await documentExportStore.exportCombined(
          cvGenerationStore.currentAdaptedCV,
          cvGenerationStore.generatedCoverLetter,
          `application_${Date.now()}.${format}`
        )
      } else {
        const exports = await Promise.all([
          documentExportStore.exportCV(
            cvGenerationStore.currentAdaptedCV,
            `cv_${Date.now()}.${format}`
          ),
          documentExportStore.exportCoverLetter(
            cvGenerationStore.generatedCoverLetter,
            `cover_letter_${Date.now()}.${format}`
          )
        ])

        return { cv: exports[0], letter: exports[1] }
      }
    } catch (error) {
      errorHandlerStore.handleError(
        error as Error,
        'file_processing', // ErrorType.FILE_PROCESSING
        'medium', // ErrorSeverity.MEDIUM
        {
          component: 'CVWorkflow',
          action: 'exportDocuments'
        }
      )
      throw error
    }
  }

  // State management
  const resetWorkflow = () => {
    jobAnalysisStore.reset()
    cvGenerationStore.reset()
    documentExportStore.reset()
    errorHandlerStore.resolveAllErrors()
  }

  const pauseWorkflow = () => {
    // Cancel any ongoing exports
    documentExportStore.activeJobs.forEach(job => {
      documentExportStore.cancelExport(job.id)
    })
  }

  // Utility methods
  const getWorkflowHistory = () => ({
    analyses: jobAnalysisStore.analysisHistory,
    generations: cvGenerationStore.generationHistory,
    exports: documentExportStore.exportHistory
  })

  const getWorkflowStats = () => ({
    totalAnalyses: jobAnalysisStore.analysisHistoryCount,
    totalGenerations: cvGenerationStore.generationHistoryCount,
    totalExports: documentExportStore.totalExports,
    successRate: documentExportStore.successRate,
    averageExportTime: documentExportStore.averageExportTime
  })

  // Error recovery
  const retryCurrentStep = async () => {
    try {
      if (jobAnalysisStore.error && jobAnalysisStore.currentJobOfferText) {
        return await analyzeJobOffer(jobAnalysisStore.currentJobOfferText)
      }

      if (cvGenerationStore.error && jobAnalysisStore.currentAnalysis) {
        return await generateCV(jobAnalysisStore.currentAnalysis)
      }

      if (documentExportStore.activeJobs.some(job => job.status === 'failed')) {
        // Retry failed exports
        const failedJobs = documentExportStore.activeJobs.filter(job => job.status === 'failed')
        for (const job of failedJobs) {
          if (job.type === 'cv' && cvGenerationStore.currentAdaptedCV) {
            await documentExportStore.exportCV(cvGenerationStore.currentAdaptedCV)
          } else if (job.type === 'cover_letter' && cvGenerationStore.generatedCoverLetter) {
            await documentExportStore.exportCoverLetter(cvGenerationStore.generatedCoverLetter)
          }
        }
      }
    } catch (error) {
      errorHandlerStore.handleError(error as Error)
      throw error
    }
  }

  return {
    // State
    isProcessing: readonly(isProcessing),
    hasError: readonly(hasError),
    canStartWorkflow: readonly(canStartWorkflow),
    workflowProgress: readonly(workflowProgress),
    currentStep: readonly(currentStep),

    // Current data
    currentAnalysis: readonly(toRef(jobAnalysisStore, 'currentAnalysis')),
    currentAdaptedCV: readonly(toRef(cvGenerationStore, 'currentAdaptedCV')),
    currentCoverLetter: readonly(toRef(cvGenerationStore, 'generatedCoverLetter')),
    currentError: readonly(toRef(errorHandlerStore, 'error')),

    // Actions
    startCompleteWorkflow,
    analyzeJobOffer,
    generateCV,
    exportDocuments,
    resetWorkflow,
    pauseWorkflow,
    retryCurrentStep,

    // Utilities
    getWorkflowHistory,
    getWorkflowStats,

    // Store access (for advanced usage)
    stores: {
      jobAnalysis: jobAnalysisStore,
      cvGeneration: cvGenerationStore,
      errorHandler: errorHandlerStore,
      documentExport: documentExportStore
    }
  }
}