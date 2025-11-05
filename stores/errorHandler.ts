import { defineStore } from 'pinia'

export interface AppError {
  id: string
  timestamp: Date
  type: ErrorType
  severity: ErrorSeverity
  code: string
  message: string
  userMessage: string
  context?: ErrorContext
  stack?: string
  resolved: boolean
  resolvedAt?: Date
  actions?: ErrorAction[]
}

export enum ErrorType {
  VALIDATION = 'validation',
  API = 'api',
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  FILE_PROCESSING = 'file_processing',
  PDF_GENERATION = 'pdf_generation',
  PARSING = 'parsing',
  TIMEOUT = 'timeout',
  RATE_LIMIT = 'rate_limit',
  UNKNOWN = 'unknown'
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface ErrorContext {
  component?: string
  action?: string
  userId?: string
  sessionId?: string
  url?: string
  userAgent?: string
  additionalData?: Record<string, any>
}

export interface ErrorAction {
  id: string
  label: string
  action: () => void | Promise<void>
  primary?: boolean
}

export interface ErrorHandlerState {
  // Current errors
  errors: AppError[]
  activeError: AppError | null

  // Error display state
  showErrorModal: boolean
  showErrorBanner: boolean
  showErrorToast: boolean

  // Statistics
  errorCounts: Record<ErrorType, number>
  recentErrors: AppError[]

  // Settings
  settings: {
    autoResolveTimeout: number // minutes
    maxErrorHistory: number
    enableStackTrace: boolean
    enableUserReporting: boolean
    logLevel: 'debug' | 'info' | 'warn' | 'error'
  }

  // User feedback
  userFeedback: Map<string, string> // errorId -> user feedback
}

export const useErrorHandlerStore = defineStore('errorHandler', {
  state: (): ErrorHandlerState => ({
    errors: [],
    activeError: null,

    showErrorModal: false,
    showErrorBanner: false,
    showErrorToast: false,

    errorCounts: {
      [ErrorType.VALIDATION]: 0,
      [ErrorType.API]: 0,
      [ErrorType.NETWORK]: 0,
      [ErrorType.AUTHENTICATION]: 0,
      [ErrorType.AUTHORIZATION]: 0,
      [ErrorType.FILE_PROCESSING]: 0,
      [ErrorType.PDF_GENERATION]: 0,
      [ErrorType.PARSING]: 0,
      [ErrorType.TIMEOUT]: 0,
      [ErrorType.RATE_LIMIT]: 0,
      [ErrorType.UNKNOWN]: 0
    },
    recentErrors: [],

    settings: {
      autoResolveTimeout: 5, // 5 minutes
      maxErrorHistory: 100,
      enableStackTrace: process.env.NODE_ENV === 'development',
      enableUserReporting: true,
      logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'error'
    },

    userFeedback: new Map()
  }),

  getters: {
    hasErrors: (state) => state.errors.length > 0,

    unresolvedErrors: (state) => state.errors.filter(error => !error.resolved),

    criticalErrors: (state) =>
      state.errors.filter(error =>
        error.severity === ErrorSeverity.CRITICAL && !error.resolved
      ),

    hasCriticalErrors: (state) =>
      state.errors.some(error =>
        error.severity === ErrorSeverity.CRITICAL && !error.resolved
      ),

    errorsByType: (state) => {
      return state.errors.reduce((acc, error) => {
        if (!acc[error.type]) acc[error.type] = []
        acc[error.type].push(error)
        return acc
      }, {} as Record<ErrorType, AppError[]>)
    },

    shouldShowErrorDisplay: (state) =>
      state.showErrorModal || state.showErrorBanner || state.showErrorToast,

    errorSummary: (state) => {
      const total = state.errors.length
      const unresolved = state.errors.filter(e => !e.resolved).length
      const critical = state.errors.filter(e =>
        e.severity === ErrorSeverity.CRITICAL && !e.resolved
      ).length

      return { total, unresolved, critical }
    }
  },

  actions: {
    // Main error handling method
    handleError(
      error: Error | string,
      type: ErrorType = ErrorType.UNKNOWN,
      severity: ErrorSeverity = ErrorSeverity.MEDIUM,
      context?: Partial<ErrorContext>
    ): AppError {
      const appError = this.createAppError(error, type, severity, context)

      this.addError(appError)
      this.logError(appError)
      this.showErrorToUser(appError)

      return appError
    },

    // Create structured error object
    createAppError(
      error: Error | string,
      type: ErrorType,
      severity: ErrorSeverity,
      context?: Partial<ErrorContext>
    ): AppError {
      const message = typeof error === 'string' ? error : error.message
      const stack = typeof error === 'object' ? error.stack : undefined

      return {
        id: this.generateErrorId(),
        timestamp: new Date(),
        type,
        severity,
        code: this.generateErrorCode(type),
        message,
        userMessage: this.generateUserMessage(type, message),
        context: {
          url: typeof window !== 'undefined' ? window.location.href : undefined,
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
          ...context
        },
        stack: this.settings.enableStackTrace ? stack : undefined,
        resolved: false,
        actions: this.generateErrorActions(type, severity)
      }
    },

    // Add error to store
    addError(error: AppError) {
      this.errors.push(error)
      this.recentErrors.unshift(error)
      this.errorCounts[error.type]++

      // Keep recent errors limited
      if (this.recentErrors.length > 20) {
        this.recentErrors = this.recentErrors.slice(0, 20)
      }

      // Keep total errors limited
      if (this.errors.length > this.settings.maxErrorHistory) {
        this.errors = this.errors.slice(-this.settings.maxErrorHistory)
      }

      // Set up auto-resolve timer
      if (this.settings.autoResolveTimeout > 0) {
        setTimeout(() => {
          this.resolveError(error.id)
        }, this.settings.autoResolveTimeout * 60 * 1000)
      }
    },

    // Show error to user based on severity
    showErrorToUser(error: AppError) {
      switch (error.severity) {
        case ErrorSeverity.CRITICAL:
          this.showModal(error)
          break
        case ErrorSeverity.HIGH:
          this.showBanner(error)
          break
        case ErrorSeverity.MEDIUM:
        case ErrorSeverity.LOW:
          this.showToast(error)
          break
      }
    },

    // Show error modal (for critical errors)
    showModal(error: AppError) {
      this.activeError = error
      this.showErrorModal = true
    },

    // Show error banner (for high severity errors)
    showBanner(error: AppError) {
      this.activeError = error
      this.showErrorBanner = true
    },

    // Show error toast (for medium/low severity errors)
    showToast(error: AppError) {
      this.activeError = error
      this.showErrorToast = true

      // Auto-hide toast after 5 seconds
      setTimeout(() => {
        if (this.activeError?.id === error.id) {
          this.hideToast()
        }
      }, 5000)
    },

    // Hide error displays
    hideModal() {
      this.showErrorModal = false
      this.activeError = null
    },

    hideBanner() {
      this.showErrorBanner = false
      this.activeError = null
    },

    hideToast() {
      this.showErrorToast = false
      this.activeError = null
    },

    // Resolve error
    resolveError(errorId: string) {
      const error = this.errors.find(e => e.id === errorId)
      if (error) {
        error.resolved = true
        error.resolvedAt = new Date()

        // Hide error display if it's the active error
        if (this.activeError?.id === errorId) {
          this.hideModal()
          this.hideBanner()
          this.hideToast()
        }
      }
    },

    // Resolve all errors
    resolveAllErrors() {
      this.errors.forEach(error => {
        if (!error.resolved) {
          error.resolved = true
          error.resolvedAt = new Date()
        }
      })

      this.hideModal()
      this.hideBanner()
      this.hideToast()
    },

    // Remove error from history
    removeError(errorId: string) {
      this.errors = this.errors.filter(e => e.id !== errorId)
      this.recentErrors = this.recentErrors.filter(e => e.id !== errorId)
      this.userFeedback.delete(errorId)

      if (this.activeError?.id === errorId) {
        this.hideModal()
        this.hideBanner()
        this.hideToast()
      }
    },

    // Clear all errors
    clearAllErrors() {
      this.errors = []
      this.recentErrors = []
      this.userFeedback.clear()
      this.resetErrorCounts()
      this.hideModal()
      this.hideBanner()
      this.hideToast()
    },

    // Add user feedback for error
    addUserFeedback(errorId: string, feedback: string) {
      this.userFeedback.set(errorId, feedback)
    },

    // Log error to console/external service
    logError(error: AppError) {
      const logData = {
        ...error,
        stack: undefined // Don't log stack trace to external services
      }

      switch (this.settings.logLevel) {
        case 'debug':
          console.debug('Error:', logData)
          break
        case 'info':
          console.info('Error:', logData)
          break
        case 'warn':
          console.warn('Error:', logData)
          break
        case 'error':
          console.error('Error:', logData)
          break
      }

      // TODO: Send to external logging service (Sentry, LogRocket, etc.)
      // if (this.settings.enableUserReporting) {
      //   this.sendToExternalService(error)
      // }
    },

    // Generate error ID
    generateErrorId(): string {
      return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    },

    // Generate error code
    generateErrorCode(type: ErrorType): string {
      const codes: Record<ErrorType, string> = {
        [ErrorType.VALIDATION]: 'VAL',
        [ErrorType.API]: 'API',
        [ErrorType.NETWORK]: 'NET',
        [ErrorType.AUTHENTICATION]: 'AUTH',
        [ErrorType.AUTHORIZATION]: 'AUTHZ',
        [ErrorType.FILE_PROCESSING]: 'FILE',
        [ErrorType.PDF_GENERATION]: 'PDF',
        [ErrorType.PARSING]: 'PARSE',
        [ErrorType.TIMEOUT]: 'TIMEOUT',
        [ErrorType.RATE_LIMIT]: 'RATE',
        [ErrorType.UNKNOWN]: 'UNK'
      }

      return `${codes[type]}_${Date.now().toString().slice(-6)}`
    },

    // Generate user-friendly message
    generateUserMessage(type: ErrorType, originalMessage: string): string {
      const userMessages: Record<ErrorType, string> = {
        [ErrorType.VALIDATION]: 'Veuillez vérifier les informations saisies.',
        [ErrorType.API]: 'Une erreur est survenue lors du traitement de votre demande.',
        [ErrorType.NETWORK]: 'Problème de connexion. Vérifiez votre connexion internet.',
        [ErrorType.AUTHENTICATION]: 'Veuillez vous reconnecter.',
        [ErrorType.AUTHORIZATION]: 'Vous n\'avez pas les droits pour cette action.',
        [ErrorType.FILE_PROCESSING]: 'Erreur lors du traitement du fichier.',
        [ErrorType.PDF_GENERATION]: 'Erreur lors de la génération du PDF.',
        [ErrorType.PARSING]: 'Erreur lors de l\'analyse des données.',
        [ErrorType.TIMEOUT]: 'L\'opération a pris trop de temps. Veuillez réessayer.',
        [ErrorType.RATE_LIMIT]: 'Trop de requêtes. Veuillez patienter avant de réessayer.',
        [ErrorType.UNKNOWN]: 'Une erreur inattendue s\'est produite.'
      }

      return userMessages[type] || originalMessage
    },

    // Generate error actions based on type and severity
    generateErrorActions(type: ErrorType, severity: ErrorSeverity): ErrorAction[] {
      const actions: ErrorAction[] = []

      // Common actions
      actions.push({
        id: 'dismiss',
        label: 'Fermer',
        action: () => this.resolveError(this.activeError!.id)
      })

      // Type-specific actions
      switch (type) {
        case ErrorType.NETWORK:
          actions.push({
            id: 'retry',
            label: 'Réessayer',
            action: () => window.location.reload(),
            primary: true
          })
          break

        case ErrorType.RATE_LIMIT:
          actions.push({
            id: 'wait',
            label: 'Patienter',
            action: () => {
              setTimeout(() => {
                this.resolveError(this.activeError!.id)
              }, 60000) // Wait 1 minute
            }
          })
          break

        case ErrorType.AUTHENTICATION:
          actions.push({
            id: 'login',
            label: 'Se reconnecter',
            action: () => {
              // TODO: Implement login redirect
              console.log('Redirect to login')
            },
            primary: true
          })
          break
      }

      // Severity-specific actions
      if (severity === ErrorSeverity.CRITICAL) {
        actions.push({
          id: 'reload',
          label: 'Recharger la page',
          action: () => window.location.reload()
        })
      }

      return actions
    },

    // Reset error counts
    resetErrorCounts() {
      Object.keys(this.errorCounts).forEach(key => {
        this.errorCounts[key as ErrorType] = 0
      })
    },

    // Update settings
    updateSettings(newSettings: Partial<ErrorHandlerState['settings']>) {
      this.settings = { ...this.settings, ...newSettings }
    },

    // Get error by ID
    getErrorById(id: string): AppError | null {
      return this.errors.find(error => error.id === id) || null
    },

    // Specialized error handlers
    handleValidationError(message: string, context?: Partial<ErrorContext>) {
      return this.handleError(message, ErrorType.VALIDATION, ErrorSeverity.LOW, context)
    },

    handleAPIError(error: Error, context?: Partial<ErrorContext>) {
      return this.handleError(error, ErrorType.API, ErrorSeverity.MEDIUM, context)
    },

    handleNetworkError(error: Error, context?: Partial<ErrorContext>) {
      return this.handleError(error, ErrorType.NETWORK, ErrorSeverity.HIGH, context)
    },

    handleCriticalError(error: Error, context?: Partial<ErrorContext>) {
      return this.handleError(error, ErrorType.UNKNOWN, ErrorSeverity.CRITICAL, context)
    }
  }
})