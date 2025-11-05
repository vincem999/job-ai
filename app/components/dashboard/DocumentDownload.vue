<template>
  <div class="document-download">
    <div class="download-header">
      <h3 class="download-title">Télécharger les documents</h3>
      <p class="download-description">
        Téléchargez votre CV adapté et votre lettre de motivation dans différents formats
      </p>
    </div>

    <div class="download-sections">
      <!-- CV Download Section -->
      <div class="download-section cv-section">
        <div class="section-header">
          <UIcon name="i-heroicons-document-text" class="section-icon" />
          <div>
            <h4 class="section-title">CV Adapté</h4>
            <p class="section-subtitle">
              {{ cvData ? 'CV prêt pour téléchargement' : 'Aucun CV généré' }}
            </p>
          </div>
        </div>

        <div v-if="cvData" class="download-options">
          <div class="format-selection">
            <label class="format-label">Format de téléchargement :</label>
            <USelectMenu
              v-model="selectedCVFormat"
              :options="formatOptions"
              placeholder="Choisir un format"
              class="format-select"
            />
          </div>

          <div class="download-actions">
            <UButton
              :loading="isDownloadingCV"
              :disabled="!selectedCVFormat || isDownloadingCV"
              class="download-btn"
              icon="i-heroicons-arrow-down-tray"
              @click="downloadCV"
            >
              {{ isDownloadingCV ? 'Téléchargement...' : 'Télécharger CV' }}
            </UButton>

            <UButton
              v-if="lastCVDownload"
              variant="outline"
              icon="i-heroicons-arrow-path"
              size="sm"
              @click="downloadFromUrl(lastCVDownload.downloadUrl, lastCVDownload.filename)"
            >
              Retélécharger
            </UButton>
          </div>
        </div>

        <div v-else class="no-document">
          <UIcon name="i-heroicons-exclamation-triangle" class="warning-icon" />
          <p>Générez d'abord un CV pour pouvoir le télécharger</p>
        </div>
      </div>

      <!-- Cover Letter Download Section -->
      <div class="download-section letter-section">
        <div class="section-header">
          <UIcon name="i-heroicons-envelope" class="section-icon" />
          <div>
            <h4 class="section-title">Lettre de Motivation</h4>
            <p class="section-subtitle">
              {{ letterData ? 'Lettre prête pour téléchargement' : 'Aucune lettre générée' }}
            </p>
          </div>
        </div>

        <div v-if="letterData" class="download-options">
          <div class="format-selection">
            <label class="format-label">Format de téléchargement :</label>
            <USelectMenu
              v-model="selectedLetterFormat"
              :options="formatOptions"
              placeholder="Choisir un format"
              class="format-select"
            />
          </div>

          <div class="download-actions">
            <UButton
              :loading="isDownloadingLetter"
              :disabled="!selectedLetterFormat || isDownloadingLetter"
              class="download-btn"
              icon="i-heroicons-arrow-down-tray"
              @click="downloadLetter"
            >
              {{ isDownloadingLetter ? 'Téléchargement...' : 'Télécharger Lettre' }}
            </UButton>

            <UButton
              v-if="lastLetterDownload"
              variant="outline"
              icon="i-heroicons-arrow-path"
              size="sm"
              @click="downloadFromUrl(lastLetterDownload.downloadUrl, lastLetterDownload.filename)"
            >
              Retélécharger
            </UButton>
          </div>
        </div>

        <div v-else class="no-document">
          <UIcon name="i-heroicons-exclamation-triangle" class="warning-icon" />
          <p>Générez d'abord une lettre pour pouvoir la télécharger</p>
        </div>
      </div>

      <!-- Bulk Download Section -->
      <div v-if="cvData && letterData" class="download-section bulk-section">
        <div class="section-header">
          <UIcon name="i-heroicons-archive-box" class="section-icon" />
          <div>
            <h4 class="section-title">Téléchargement Groupé</h4>
            <p class="section-subtitle">Téléchargez CV et lettre en une seule archive</p>
          </div>
        </div>

        <div class="download-actions">
          <UButton
            :loading="isDownloadingBulk"
            :disabled="isDownloadingBulk"
            class="download-btn bulk-btn"
            icon="i-heroicons-archive-box-arrow-down"
            variant="outline"
            @click="downloadBulk"
          >
            {{ isDownloadingBulk ? 'Création de l\'archive...' : 'Télécharger Archive ZIP' }}
          </UButton>
        </div>
      </div>
    </div>

    <!-- Download History -->
    <div v-if="downloadHistory.length > 0" class="download-history">
      <h4 class="history-title">Historique des téléchargements</h4>
      <div class="history-list">
        <div
          v-for="download in downloadHistory"
          :key="download.id"
          class="history-item"
        >
          <div class="history-info">
            <UIcon :name="getDocumentIcon(download.type)" class="history-icon" />
            <div>
              <p class="history-filename">{{ download.filename }}</p>
              <p class="history-meta">
                {{ formatFileSize(download.size) }} • {{ formatDate(download.downloadedAt) }}
              </p>
            </div>
          </div>
          <UButton
            v-if="!isExpired(download.expiresAt)"
            variant="ghost"
            size="sm"
            icon="i-heroicons-arrow-down-tray"
            @click="downloadFromUrl(download.downloadUrl, download.filename)"
          >
            Télécharger
          </UButton>
          <span v-else class="expired-badge">Expiré</span>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <UAlert
      v-if="errorMessage"
      color="error"
      variant="soft"
      :title="errorMessage"
      class="error-alert"
      @close="errorMessage = null"
    />

    <!-- Success Display -->
    <UAlert
      v-if="successMessage"
      color="success"
      variant="soft"
      :title="successMessage"
      class="success-alert"
      @close="successMessage = null"
    />
  </div>
</template>

<script setup lang="ts">
import type { AdaptedCV } from '../../../types/cv'
import type { CoverLetter, ExportFormat, ExportResult, ExportDocumentRequest } from '../../../types/api'

interface Props {
  cvData?: AdaptedCV
  letterData?: CoverLetter
  cvId?: string
  letterId?: string
}

const props = defineProps<Props>()

// Reactive state
const selectedCVFormat = ref<ExportFormat>()
const selectedLetterFormat = ref<ExportFormat>()
const isDownloadingCV = ref(false)
const isDownloadingLetter = ref(false)
const isDownloadingBulk = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const lastCVDownload = ref<ExportResult | null>(null)
const lastLetterDownload = ref<ExportResult | null>(null)

// Download history
const downloadHistory = ref<Array<{
  id: string
  type: 'cv' | 'letter'
  filename: string
  downloadUrl: string
  size: number
  expiresAt: Date
  downloadedAt: Date
}>>([])

// Format options
const formatOptions = [
  { label: 'PDF', value: 'pdf' as ExportFormat },
  { label: 'Word (.docx)', value: 'docx' as ExportFormat },
  { label: 'HTML', value: 'html' as ExportFormat },
  { label: 'Texte (.txt)', value: 'txt' as ExportFormat }
]

// Methods
const downloadCV = async () => {
  if (!props.cvData || !props.cvId || !selectedCVFormat.value) return

  isDownloadingCV.value = true
  errorMessage.value = null

  try {
    const exportRequest: ExportDocumentRequest = {
      documentId: props.cvId,
      documentType: 'cv',
      format: selectedCVFormat.value,
      options: {
        template: 'modern',
        includeMetadata: true
      }
    }

    const { data } = await $fetch<{ data: ExportResult }>('/api/export', {
      method: 'POST',
      body: exportRequest
    })

    lastCVDownload.value = data

    // Add to history
    downloadHistory.value.unshift({
      id: `cv-${Date.now()}`,
      type: 'cv',
      filename: data.filename,
      downloadUrl: data.downloadUrl,
      size: data.size,
      expiresAt: data.expiresAt,
      downloadedAt: new Date()
    })

    // Trigger download
    await downloadFromUrl(data.downloadUrl, data.filename)

    successMessage.value = `CV téléchargé avec succès (${data.filename})`
  } catch (error) {
    console.error('Erreur lors du téléchargement du CV:', error)
    errorMessage.value = 'Erreur lors du téléchargement du CV. Veuillez réessayer.'
  } finally {
    isDownloadingCV.value = false
  }
}

const downloadLetter = async () => {
  if (!props.letterData || !props.letterId || !selectedLetterFormat.value) return

  isDownloadingLetter.value = true
  errorMessage.value = null

  try {
    const exportRequest: ExportDocumentRequest = {
      documentId: props.letterId,
      documentType: 'letter',
      format: selectedLetterFormat.value,
      options: {
        template: 'professional',
        includeMetadata: true
      }
    }

    const { data } = await $fetch<{ data: ExportResult }>('/api/export', {
      method: 'POST',
      body: exportRequest
    })

    lastLetterDownload.value = data

    // Add to history
    downloadHistory.value.unshift({
      id: `letter-${Date.now()}`,
      type: 'letter',
      filename: data.filename,
      downloadUrl: data.downloadUrl,
      size: data.size,
      expiresAt: data.expiresAt,
      downloadedAt: new Date()
    })

    // Trigger download
    await downloadFromUrl(data.downloadUrl, data.filename)

    successMessage.value = `Lettre téléchargée avec succès (${data.filename})`
  } catch (error) {
    console.error('Erreur lors du téléchargement de la lettre:', error)
    errorMessage.value = 'Erreur lors du téléchargement de la lettre. Veuillez réessayer.'
  } finally {
    isDownloadingLetter.value = false
  }
}

const downloadBulk = async () => {
  if (!props.cvData || !props.letterData || !props.cvId || !props.letterId) return

  isDownloadingBulk.value = true
  errorMessage.value = null

  try {
    // Download both documents and create a ZIP
    const cvRequest: ExportDocumentRequest = {
      documentId: props.cvId,
      documentType: 'cv',
      format: 'pdf' as ExportFormat
    }

    const letterRequest: ExportDocumentRequest = {
      documentId: props.letterId,
      documentType: 'letter',
      format: 'pdf' as ExportFormat
    }

    const [cvResult, letterResult] = await Promise.all([
      $fetch<{ data: ExportResult }>('/api/export', {
        method: 'POST',
        body: cvRequest
      }),
      $fetch<{ data: ExportResult }>('/api/export', {
        method: 'POST',
        body: letterRequest
      })
    ])

    // Create ZIP archive
    const zipData = await $fetch<{ data: { downloadUrl: string, filename: string, size: number } }>('/api/export/bulk', {
      method: 'POST',
      body: {
        documents: [cvResult.data, letterResult.data]
      }
    })

    // Add to history
    downloadHistory.value.unshift({
      id: `bulk-${Date.now()}`,
      type: 'cv',
      filename: zipData.data.filename,
      downloadUrl: zipData.data.downloadUrl,
      size: zipData.data.size,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
      downloadedAt: new Date()
    })

    // Trigger download
    await downloadFromUrl(zipData.data.downloadUrl, zipData.data.filename)

    successMessage.value = `Archive téléchargée avec succès (${zipData.data.filename})`
  } catch (error) {
    console.error('Erreur lors du téléchargement groupé:', error)
    errorMessage.value = 'Erreur lors du téléchargement groupé. Veuillez réessayer.'
  } finally {
    isDownloadingBulk.value = false
  }
}

const downloadFromUrl = async (url: string, filename: string) => {
  try {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error)
    throw error
  }
}

// Utility functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

const isExpired = (expiresAt: Date): boolean => {
  return new Date() > new Date(expiresAt)
}

const getDocumentIcon = (type: 'cv' | 'letter'): string => {
  return type === 'cv' ? 'i-heroicons-document-text' : 'i-heroicons-envelope'
}

// Set default formats
onMounted(() => {
  selectedCVFormat.value = 'pdf' as ExportFormat
  selectedLetterFormat.value = 'pdf' as ExportFormat
})

// Auto-dismiss messages
watch([errorMessage, successMessage], () => {
  if (errorMessage.value) {
    setTimeout(() => {
      errorMessage.value = null
    }, 5000)
  }
  if (successMessage.value) {
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
  }
})
</script>

<style scoped>
.document-download {
  @apply w-full space-y-6;
}

.download-header {
  @apply text-center pb-6 border-b border-gray-200;
}

.download-title {
  @apply text-2xl font-bold text-gray-900 mb-2;
}

.download-description {
  @apply text-gray-600 text-sm;
}

.download-sections {
  @apply space-y-6;
}

.download-section {
  @apply bg-white rounded-lg border border-gray-200 p-6 shadow-sm;
}

.section-header {
  @apply flex items-center gap-4 mb-4;
}

.section-icon {
  @apply w-8 h-8 text-blue-500;
}

.section-title {
  @apply text-lg font-semibold text-gray-900;
}

.section-subtitle {
  @apply text-sm text-gray-600;
}

.download-options {
  @apply space-y-4;
}

.format-selection {
  @apply space-y-2;
}

.format-label {
  @apply block text-sm font-medium text-gray-700;
}

.format-select {
  @apply w-full max-w-xs;
}

.download-actions {
  @apply flex items-center gap-3 flex-wrap;
}

.download-btn {
  @apply min-w-[140px];
}

.bulk-btn {
  @apply w-full justify-center;
}

.no-document {
  @apply flex items-center gap-3 text-gray-500 bg-gray-50 rounded-lg p-4;
}

.warning-icon {
  @apply w-5 h-5 text-yellow-500;
}

.bulk-section {
  @apply bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200;
}

.download-history {
  @apply space-y-4;
}

.history-title {
  @apply text-lg font-semibold text-gray-900;
}

.history-list {
  @apply space-y-2;
}

.history-item {
  @apply flex items-center justify-between bg-gray-50 rounded-lg p-4;
}

.history-info {
  @apply flex items-center gap-3;
}

.history-icon {
  @apply w-5 h-5 text-gray-400;
}

.history-filename {
  @apply font-medium text-gray-900;
}

.history-meta {
  @apply text-sm text-gray-500;
}

.expired-badge {
  @apply text-xs text-red-600 bg-red-100 px-2 py-1 rounded;
}

.error-alert,
.success-alert {
  @apply mt-4;
}

/* Responsive design */
@media (max-width: 640px) {
  .download-actions {
    @apply flex-col items-stretch;
  }

  .download-btn {
    @apply w-full min-w-0;
  }

  .history-item {
    @apply flex-col items-start gap-3;
  }
}
</style>