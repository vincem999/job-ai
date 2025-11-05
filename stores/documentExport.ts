import { defineStore } from 'pinia'

export interface ExportJob {
  id: string
  type: DocumentType
  status: ExportStatus
  progress: number
  startTime: Date
  endTime?: Date
  filename: string
  size?: number
  error?: string
  downloadUrl?: string
}

export enum DocumentType {
  CV = 'cv',
  COVER_LETTER = 'cover_letter',
  COMBINED = 'combined'
}

export enum ExportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'html'
  quality: 'draft' | 'standard' | 'high'
  template: string
  includeWatermark: boolean
  margins: {
    top: number
    right: number
    bottom: number
    left: number
  }
  orientation: 'portrait' | 'landscape'
  paperSize: 'a4' | 'letter' | 'legal'
}

export interface DocumentExportState {
  // Current export jobs
  activeJobs: ExportJob[]
  completedJobs: ExportJob[]

  // Export queue
  exportQueue: ExportJob[]
  isProcessingQueue: boolean
  maxConcurrentExports: number

  // Current export state
  currentExport: ExportJob | null
  isExporting: boolean

  // Export history
  exportHistory: ExportJob[]

  // Default export options
  defaultOptions: ExportOptions

  // Statistics
  totalExports: number
  successfulExports: number
  failedExports: number

  // Settings
  settings: {
    autoDownload: boolean
    deleteAfterDownload: boolean
    retainHistoryDays: number
    compressionLevel: number
    enableBatchExport: boolean
  }
}

export const useDocumentExportStore = defineStore('documentExport', {
  state: (): DocumentExportState => ({
    activeJobs: [],
    completedJobs: [],

    exportQueue: [],
    isProcessingQueue: false,
    maxConcurrentExports: 3,

    currentExport: null,
    isExporting: false,

    exportHistory: [],

    defaultOptions: {
      format: 'pdf',
      quality: 'standard',
      template: 'default',
      includeWatermark: false,
      margins: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      },
      orientation: 'portrait',
      paperSize: 'a4'
    },

    totalExports: 0,
    successfulExports: 0,
    failedExports: 0,

    settings: {
      autoDownload: true,
      deleteAfterDownload: false,
      retainHistoryDays: 30,
      compressionLevel: 80,
      enableBatchExport: true
    }
  }),

  getters: {
    canExport: (state) =>
      !state.isExporting &&
      state.activeJobs.length < state.maxConcurrentExports,

    hasActiveJobs: (state) => state.activeJobs.length > 0,

    isProcessing: (state) =>
      state.isExporting ||
      state.isProcessingQueue ||
      state.activeJobs.some(job => job.status === ExportStatus.PROCESSING),

    queueLength: (state) => state.exportQueue.length,

    successRate: (state) =>
      state.totalExports > 0
        ? Math.round((state.successfulExports / state.totalExports) * 100)
        : 0,

    averageExportTime: (state) => {
      const completedJobs = state.completedJobs.filter(job =>
        job.status === ExportStatus.COMPLETED && job.endTime
      )

      if (completedJobs.length === 0) return 0

      const totalTime = completedJobs.reduce((sum, job) => {
        const duration = job.endTime!.getTime() - job.startTime.getTime()
        return sum + duration
      }, 0)

      return Math.round(totalTime / completedJobs.length / 1000) // seconds
    },

    recentExports: (state) =>
      state.exportHistory
        .filter(job => {
          const daysDiff = (Date.now() - job.startTime.getTime()) / (1000 * 60 * 60 * 24)
          return daysDiff <= 7 // Last 7 days
        })
        .sort((a, b) => b.startTime.getTime() - a.startTime.getTime()),

    exportsByType: (state) => {
      return state.exportHistory.reduce((acc, job) => {
        acc[job.type] = (acc[job.type] || 0) + 1
        return acc
      }, {} as Record<DocumentType, number>)
    }
  },

  actions: {
    // Export CV as PDF
    async exportCV(
      cvData: any,
      filename?: string,
      options?: Partial<ExportOptions>
    ): Promise<ExportJob> {
      const exportOptions = { ...this.defaultOptions, ...options }
      const job = this.createExportJob(
        DocumentType.CV,
        filename || `cv_${Date.now()}.pdf`,
        exportOptions
      )

      return this.processExport(job, async () => {
        return await this.generatePDF(cvData, 'cv', exportOptions)
      })
    },

    // Export cover letter as PDF
    async exportCoverLetter(
      letterData: any,
      filename?: string,
      options?: Partial<ExportOptions>
    ): Promise<ExportJob> {
      const exportOptions = { ...this.defaultOptions, ...options }
      const job = this.createExportJob(
        DocumentType.COVER_LETTER,
        filename || `cover_letter_${Date.now()}.pdf`,
        exportOptions
      )

      return this.processExport(job, async () => {
        return await this.generatePDF(letterData, 'letter', exportOptions)
      })
    },

    // Export combined CV and cover letter
    async exportCombined(
      cvData: any,
      letterData: any,
      filename?: string,
      options?: Partial<ExportOptions>
    ): Promise<ExportJob> {
      const exportOptions = { ...this.defaultOptions, ...options }
      const job = this.createExportJob(
        DocumentType.COMBINED,
        filename || `application_${Date.now()}.pdf`,
        exportOptions
      )

      return this.processExport(job, async () => {
        return await this.generateCombinedPDF(cvData, letterData, exportOptions)
      })
    },

    // Batch export multiple documents
    async batchExport(exports: Array<{
      type: DocumentType,
      data: any,
      filename?: string,
      options?: Partial<ExportOptions>
    }>): Promise<ExportJob[]> {
      if (!this.settings.enableBatchExport) {
        throw new Error('Batch export is disabled')
      }

      const jobs: ExportJob[] = []

      for (const exp of exports) {
        const job = this.createExportJob(
          exp.type,
          exp.filename || `${exp.type}_${Date.now()}.pdf`,
          { ...this.defaultOptions, ...exp.options }
        )

        this.addToQueue(job)
        jobs.push(job)
      }

      this.processQueue()
      return jobs
    },

    // Create export job
    createExportJob(
      type: DocumentType,
      filename: string,
      _options: ExportOptions
    ): ExportJob {
      return {
        id: this.generateJobId(),
        type,
        status: ExportStatus.PENDING,
        progress: 0,
        startTime: new Date(),
        filename,
        error: undefined,
        downloadUrl: undefined
      }
    },

    // Process single export
    async processExport(
      job: ExportJob,
      generator: () => Promise<{ blob: Blob; downloadUrl: string }>
    ): Promise<ExportJob> {
      this.startExport(job)

      try {
        job.status = ExportStatus.PROCESSING
        job.progress = 10

        // Generate document
        this.updateProgress(job.id, 30)
        const result = await generator()

        // Finalize export
        this.updateProgress(job.id, 90)
        job.downloadUrl = result.downloadUrl
        job.size = result.blob.size

        // Complete export
        this.completeExport(job)

        // Auto download if enabled
        if (this.settings.autoDownload) {
          this.downloadDocument(job)
        }

        return job

      } catch (error) {
        this.failExport(job, error as Error)
        throw error
      }
    },

    // Generate PDF using html2pdf.js (client-side)
    async generatePDF(
      data: any,
      template: 'cv' | 'letter',
      options: ExportOptions
    ): Promise<{ blob: Blob; downloadUrl: string }> {
      // Import html2pdf.js dynamically
      const html2pdf = await import('html2pdf.js')

      // Create HTML content
      const htmlContent = this.generateHTML(data, template)

      // Configure html2pdf options
      const pdfOptions = {
        margin: [
          options.margins.top,
          options.margins.right,
          options.margins.bottom,
          options.margins.left
        ],
        filename: `temp_${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: options.quality === 'high' ? 0.98 : 0.8 },
        html2canvas: {
          scale: options.quality === 'high' ? 2 : 1,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: {
          unit: 'mm',
          format: options.paperSize,
          orientation: options.orientation
        }
      }

      // Generate PDF
      const pdf = await html2pdf.default()
        .set(pdfOptions)
        .from(htmlContent)
        .outputPdf('blob')

      // Create download URL
      const blob = new Blob([pdf], { type: 'application/pdf' })
      const downloadUrl = URL.createObjectURL(blob)

      return { blob, downloadUrl }
    },

    // Generate combined PDF
    async generateCombinedPDF(
      cvData: any,
      letterData: any,
      options: ExportOptions
    ): Promise<{ blob: Blob; downloadUrl: string }> {
      // Generate individual PDFs
      const cvResult = await this.generatePDF(cvData, 'cv', options)
      const letterResult = await this.generatePDF(letterData, 'letter', options)

      // Combine PDFs (simplified - in real implementation, use PDF-lib)
      const _combinedSize = cvResult.blob.size + letterResult.blob.size
      const combinedBlob = new Blob([cvResult.blob, letterResult.blob], {
        type: 'application/pdf'
      })
      const downloadUrl = URL.createObjectURL(combinedBlob)

      // Clean up individual URLs
      URL.revokeObjectURL(cvResult.downloadUrl)
      URL.revokeObjectURL(letterResult.downloadUrl)

      return { blob: combinedBlob, downloadUrl }
    },

    // Generate HTML for template
    generateHTML(data: any, template: 'cv' | 'letter'): string {
      // This would use the actual Vue components to generate HTML
      // For now, return placeholder HTML
      return `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              .document { max-width: 800px; margin: 0 auto; }
            </style>
          </head>
          <body>
            <div class="document">
              <h1>${template === 'cv' ? 'Curriculum Vitae' : 'Cover Letter'}</h1>
              <p>Generated on ${new Date().toLocaleString()}</p>
              <!-- Template content would be inserted here -->
            </div>
          </body>
        </html>
      `
    },

    // Start export process
    startExport(job: ExportJob) {
      this.currentExport = job
      this.isExporting = true
      this.activeJobs.push(job)
      this.totalExports++
    },

    // Complete export process
    completeExport(job: ExportJob) {
      job.status = ExportStatus.COMPLETED
      job.progress = 100
      job.endTime = new Date()

      this.successfulExports++
      this.moveToCompleted(job)
      this.addToHistory(job)

      if (this.currentExport?.id === job.id) {
        this.currentExport = null
        this.isExporting = false
      }
    },

    // Fail export process
    failExport(job: ExportJob, error: Error) {
      job.status = ExportStatus.FAILED
      job.error = error.message
      job.endTime = new Date()

      this.failedExports++
      this.moveToCompleted(job)
      this.addToHistory(job)

      if (this.currentExport?.id === job.id) {
        this.currentExport = null
        this.isExporting = false
      }
    },

    // Update export progress
    updateProgress(jobId: string, progress: number) {
      const job = this.activeJobs.find(j => j.id === jobId) ||
                  this.exportQueue.find(j => j.id === jobId)

      if (job) {
        job.progress = Math.min(100, Math.max(0, progress))
      }
    },

    // Move job to completed
    moveToCompleted(job: ExportJob) {
      this.activeJobs = this.activeJobs.filter(j => j.id !== job.id)
      this.completedJobs.push(job)

      // Keep completed jobs limited
      if (this.completedJobs.length > 50) {
        this.completedJobs = this.completedJobs.slice(-50)
      }
    },

    // Add to export history
    addToHistory(job: ExportJob) {
      this.exportHistory.push(job)

      // Clean old history based on retention days
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - this.settings.retainHistoryDays)

      this.exportHistory = this.exportHistory.filter(
        h => h.startTime >= cutoffDate
      )
    },

    // Queue management
    addToQueue(job: ExportJob) {
      this.exportQueue.push(job)
    },

    async processQueue() {
      if (this.isProcessingQueue || this.exportQueue.length === 0) {
        return
      }

      this.isProcessingQueue = true

      while (this.exportQueue.length > 0 && this.activeJobs.length < this.maxConcurrentExports) {
        const job = this.exportQueue.shift()!

        // Process job based on type
        switch (job.type) {
          case DocumentType.CV:
            // Would need CV data - this is simplified
            this.processExport(job, () => this.generatePDF({}, 'cv', this.defaultOptions))
            break
          case DocumentType.COVER_LETTER:
            // Would need letter data - this is simplified
            this.processExport(job, () => this.generatePDF({}, 'letter', this.defaultOptions))
            break
          case DocumentType.COMBINED:
            // Would need both data sets - this is simplified
            this.processExport(job, () => this.generateCombinedPDF({}, {}, this.defaultOptions))
            break
        }
      }

      this.isProcessingQueue = false
    },

    // Download document
    downloadDocument(job: ExportJob) {
      if (!job.downloadUrl) {
        throw new Error('No download URL available')
      }

      // Create download link and trigger download
      const link = document.createElement('a')
      link.href = job.downloadUrl
      link.download = job.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up if auto-delete enabled
      if (this.settings.deleteAfterDownload) {
        setTimeout(() => {
          this.cleanupExport(job.id)
        }, 1000)
      }
    },

    // Cancel export
    cancelExport(jobId: string) {
      const job = this.activeJobs.find(j => j.id === jobId) ||
                  this.exportQueue.find(j => j.id === jobId)

      if (job) {
        job.status = ExportStatus.CANCELLED
        job.endTime = new Date()

        this.activeJobs = this.activeJobs.filter(j => j.id !== jobId)
        this.exportQueue = this.exportQueue.filter(j => j.id !== jobId)
        this.moveToCompleted(job)
        this.addToHistory(job)
      }
    },

    // Cleanup export resources
    cleanupExport(jobId: string) {
      const job = this.completedJobs.find(j => j.id === jobId)

      if (job?.downloadUrl) {
        URL.revokeObjectURL(job.downloadUrl)
        job.downloadUrl = undefined
      }
    },

    // Cleanup all completed exports
    cleanupAllExports() {
      this.completedJobs.forEach(job => {
        if (job.downloadUrl) {
          URL.revokeObjectURL(job.downloadUrl)
        }
      })
      this.completedJobs = []
    },

    // Update export options
    updateDefaultOptions(options: Partial<ExportOptions>) {
      this.defaultOptions = { ...this.defaultOptions, ...options }
    },

    // Update settings
    updateSettings(settings: Partial<DocumentExportState['settings']>) {
      this.settings = { ...this.settings, ...settings }
    },

    // Get job by ID
    getJobById(id: string): ExportJob | null {
      return [...this.activeJobs, ...this.completedJobs, ...this.exportQueue]
        .find(job => job.id === id) || null
    },

    // Generate unique job ID
    generateJobId(): string {
      return `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    },

    // Reset store
    reset() {
      this.activeJobs = []
      this.completedJobs = []
      this.exportQueue = []
      this.currentExport = null
      this.isExporting = false
      this.isProcessingQueue = false
    }
  }
})