<template>
  <div class="cv-preview">
    <div class="preview-header">
      <h3 class="preview-title">Aperçu du CV généré</h3>
      <div class="preview-actions">
        <UButton
          v-if="!isFullScreen"
          icon="i-heroicons-arrows-pointing-out"
          variant="outline"
          @click="toggleFullScreen"
        >
          Plein écran
        </UButton>
        <UButton
          v-else
          icon="i-heroicons-arrows-pointing-in"
          variant="outline"
          @click="toggleFullScreen"
        >
          Fermer
        </UButton>
        <UButton
          icon="i-heroicons-printer"
          variant="outline"
          @click="printCV"
        >
          Imprimer
        </UButton>
      </div>
    </div>

    <div
      ref="previewContainer"
      class="preview-container"
      :class="{ 'fullscreen': isFullScreen }"
    >
      <div class="preview-content">
        <CVTemplate :cv-data="cvData" />
      </div>
    </div>

    <!-- Fullscreen overlay -->
    <div
      v-if="isFullScreen"
      class="fullscreen-overlay"
      @click="toggleFullScreen"
    />
  </div>
</template>

<script setup lang="ts">
import CVTemplate from '../templates/CVTemplate.vue'
import type { CVData } from '../templates/mockCVData'

interface Props {
  cvData: CVData
}

defineProps<Props>()

// Reactive state
const isFullScreen = ref(false)
const previewContainer = ref<HTMLElement>()

// Methods
const toggleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value

  if (isFullScreen.value) {
    // Add class to body to prevent scrolling
    document.body.classList.add('overflow-hidden')
  } else {
    // Remove class from body to restore scrolling
    document.body.classList.remove('overflow-hidden')
  }
}

const printCV = () => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  // Get the CV template content
  const cvContent = previewContainer.value?.querySelector('.preview-content')?.innerHTML
  if (!cvContent) return

  // Create print document
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>CV Preview</title>
        <style>
          /* Include the CV template styles for printing */
          @media print {
            body { margin: 0; }
            .cv-template {
              max-width: none;
              padding: 15mm;
              font-size: 11pt;
            }
          }
        </style>
      </head>
      <body>
        ${cvContent}
      </body>
    </html>
  `)

  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
  printWindow.close()
}

// Cleanup on unmount
onUnmounted(() => {
  if (isFullScreen.value) {
    document.body.classList.remove('overflow-hidden')
  }
})

// Handle ESC key to close fullscreen
onMounted(() => {
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isFullScreen.value) {
      toggleFullScreen()
    }
  }

  document.addEventListener('keydown', handleEscape)

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>

<style scoped>
.cv-preview {
  @apply w-full;
}

.preview-header {
  @apply flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-lg border;
}

.preview-title {
  @apply text-lg font-semibold text-gray-900;
}

.preview-actions {
  @apply flex gap-2;
}

.preview-container {
  @apply relative bg-white border rounded-lg shadow-sm;
  /* Standard preview size */
  max-height: 800px;
  overflow-y: auto;
}

.preview-container.fullscreen {
  @apply fixed inset-4 z-50 bg-white rounded-lg shadow-2xl;
  max-height: calc(100vh - 2rem);
}

.preview-content {
  @apply p-4;
}

.fullscreen-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 z-40;
}

/* Custom scrollbar for preview */
.preview-container::-webkit-scrollbar {
  width: 8px;
}

.preview-container::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded;
}

.preview-container::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded hover:bg-gray-400;
}

/* Ensure CVTemplate is properly sized in preview */
.preview-content :deep(.cv-template) {
  @apply mx-auto;
  /* Scale down for preview */
  transform: scale(0.8);
  transform-origin: top center;
  width: 125%; /* Compensate for the scale */
}

.preview-container.fullscreen .preview-content :deep(.cv-template) {
  /* Full scale in fullscreen */
  transform: scale(1);
  width: 100%;
}

/* Print optimizations */
@media print {
  .cv-preview {
    @apply block;
  }

  .preview-header {
    @apply hidden;
  }

  .preview-container {
    @apply block border-0 shadow-none;
    max-height: none;
    overflow: visible;
  }

  .preview-content {
    @apply p-0;
  }

  .preview-content :deep(.cv-template) {
    transform: none;
    width: 100%;
  }
}
</style>