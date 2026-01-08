<template>
  <div class="document-download">
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

    <!-- Section de gauche - Contrôles de téléchargement -->
    <div class="download-controls">
      <UButton
        :loading="isDownloadingCV"
        :disabled="!selectedCVFormat || isDownloadingCV"
        class="download-btn"
        icon="i-heroicons-arrow-down-tray"
        @click="downloadCV"
      >
        {{ isDownloadingCV ? "Téléchargement..." : "Télécharger CV" }}
      </UButton>

      <div style="width: 100%">
        <CVTemplate :cv-data="cvData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdaptedCV } from "../../../types/cv"
import type { CoverLetter, ExportFormat } from "../../../types/api"
import CVTemplate from "../templates/CVTemplate.vue"

interface Props {
  cvData: AdaptedCV
  letterData?: CoverLetter
}

const props = defineProps<Props>()

// Reactive state
const selectedCVFormat = ref<ExportFormat>()
const selectedLetterFormat = ref<ExportFormat>()
const isDownloadingCV = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const showPreview = ref(false)

// Methods
const { generatePDF } = usePDFExport()

const downloadCV = async () => {
  if (!props.cvData || !selectedCVFormat.value) return

  // Vérifier qu'on est côté client pour la génération PDF
  if (selectedCVFormat.value === "pdf" && import.meta.server) {
    errorMessage.value = "La génération PDF n'est disponible que côté client"
    return
  }

  isDownloadingCV.value = true
  errorMessage.value = null

  try {
    if (selectedCVFormat.value === "pdf") {
      // Use client-side PDF generation with html2pdf.js
      const pdfBlob = await generatePDF(props.cvData)

      // Create download result manually
      const timestamp = new Date().toISOString().slice(0, 10)
      const filename = `CV_${timestamp}.pdf`
      const downloadUrl = URL.createObjectURL(pdfBlob)

      const result = {
        downloadUrl,
        filename,
        format: "pdf" as ExportFormat,
        size: pdfBlob.size,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        metadata: {
          pages: 1, // Estimate
          wordCount: 500, // Estimate
          generatedAt: new Date(),
        },
      }
      downloadFile(result.downloadUrl, result.filename)
    }

    successMessage.value = `CV téléchargé avec succès`
  } catch (error) {
    console.error("Erreur lors du téléchargement du CV:", error)
    errorMessage.value =
      "Erreur lors du téléchargement du CV. Veuillez réessayer."
  } finally {
    isDownloadingCV.value = false
  }
}

function downloadFile(downloadUrl: string, filename: string): void {
  const link = document.createElement("a")
  link.href = downloadUrl
  link.download = filename
  link.style.display = "none"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up the object URL after a delay
  setTimeout(() => {
    URL.revokeObjectURL(downloadUrl)
  }, 1000)
}

// Set default formats and show preview if CV data available
onMounted(() => {
  selectedCVFormat.value = "pdf" as ExportFormat
  selectedLetterFormat.value = "pdf" as ExportFormat

  // Show preview by default if CV data is available
  if (props.cvData) {
    showPreview.value = true
  }
})

// Watch for CV data changes to auto-show preview
watch(
  () => props.cvData,
  (newCvData) => {
    if (newCvData && !showPreview.value) {
      showPreview.value = true
    }
  }
)

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
@reference "~/assets/css/main.css";

.document-download {
  @apply w-full space-y-6;
}

.download-controls {
  @apply space-y-6;
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

.preview-toggle {
  @apply mt-4 pt-4 border-t border-gray-200;
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
  @apply bg-linear-to-r from-blue-50 to-indigo-50 border-blue-200;
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

/* CV Preview Section */
.cv-preview-section {
  @apply bg-white rounded-lg border border-gray-200 shadow-sm;
}

.preview-header {
  @apply p-6 border-b border-gray-200;
}

.preview-title {
  @apply flex items-center gap-2 text-xl font-semibold text-gray-900 mb-2;
}

.preview-subtitle {
  @apply text-sm text-gray-600;
}

.cv-preview-container {
  @apply p-6;
}

/* Responsive design */
@media (max-width: 1279px) {
  .download-layout {
    @apply grid-cols-1;
  }
}

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
