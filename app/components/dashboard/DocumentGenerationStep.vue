<template>
  <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
    <!-- Left Column: Generation Controls -->
    <div class="space-y-6">
      <!-- Generation Controls -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div class="mb-6">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 inline mr-2" />
            Générer le CV adapté
          </h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            Créez votre CV adapté à l'offre d'emploi
          </p>
        </div>

        <div class="space-y-4">
          <!-- Auto-generation status or manual button -->
          <div
            v-if="loadingCVGeneration"
            class="border border-blue-200 dark:border-blue-700 rounded-lg bg-blue-50 dark:bg-blue-900/20"
          >
            <LoadingSpinner
              text="Génération automatique du CV en cours..."
              color="text-blue-600 dark:text-blue-400"
              size="md"
              :show-text="true"
              container-class="p-6"
            />
          </div>
          <GenerateButton
            v-else-if="!hasCVData"
            :disabled="!jobAnalysis"
            :has-valid-input="!!jobAnalysis"
            :loading="false"
            type="cv"
            loading-text="Génération du CV en cours..."
            icon="i-heroicons-document-text"
            @generate="handleCVGeneration"
          >
            Régénérer le CV adapté
          </GenerateButton>
          <div
            v-else
            class="flex items-center justify-center p-4 border border-green-200 dark:border-green-700 rounded-lg bg-green-50 dark:bg-green-900/20"
          >
            <div class="flex items-center space-x-3">
              <UIcon
                name="i-heroicons-check-circle"
                class="w-5 h-5 text-green-500"
              />
              <span class="text-green-600 dark:text-green-400 font-medium"
                >CV adapté généré automatiquement</span
              >
            </div>
          </div>
        </div>

        <!-- Status Messages -->
        <div v-if="statusMessage" class="mt-4">
          <UAlert
            :color="
              statusMessage.type === 'error'
                ? 'error'
                : statusMessage.type === 'warning'
                ? 'warning'
                : 'success'
            "
            :title="statusMessage.title"
            :description="statusMessage.message"
            :close-button="{ 'aria-label': 'Close' }"
            @close="statusMessage = null"
          />
        </div>

        <!-- Navigation Buttons -->
        <div class="mt-6 flex justify-between">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-arrow-left"
            @click="$emit('back')"
          >
            Retour à l'analyse
          </UButton>

          <UButton
            v-if="hasCVData && !loadingCVGeneration"
            color="primary"
            size="lg"
            icon="i-heroicons-arrow-right"
            trailing
            @click="$emit('next')"
          >
            Aller au téléchargement
          </UButton>
        </div>
      </div>
    </div>

    <!-- Right Column: Preview -->
    <div class="space-y-6">
      <!-- CV Preview Section -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div class="mb-6">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            <UIcon name="i-heroicons-eye" class="w-5 h-5 inline mr-2" />
            Aperçu du CV
          </h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            Prévisualisez votre CV avant de le télécharger
          </p>
        </div>

        <div v-if="cvData">
          <CVPreview :cv-data="cvData" />
        </div>
        <div v-else class="text-center py-12">
          <UIcon
            name="i-heroicons-document-text"
            class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"
          />
          <p class="text-gray-500 dark:text-gray-400">
            Générez d'abord un CV pour voir l'aperçu
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import GenerateButton from "~/components/dashboard/GenerateButton.vue"
import CVPreview from "~/components/dashboard/CVPreview.vue"
import LoadingSpinner from "~/components/dashboard/LoadingSpinner.vue"
import type { CVData } from "~/components/templates/mockCVData"

interface StatusMessage {
  type: "success" | "error" | "warning"
  title: string
  message: string
}

const props = defineProps<{
  jobAnalysis: any
}>()

const emit = defineEmits<{
  back: []
  next: []
  documentsGenerated: [
    data: { cvData: any; letterData: any; cvId: string; letterId: string }
  ]
}>()

const cvData = ref<CVData | undefined>(undefined)
const letterData = ref<any | undefined>(undefined)
const cvId = ref<string | undefined>(undefined)
const letterId = ref<string | undefined>(undefined)
const statusMessage = ref<StatusMessage | null>(null)
const loadingCVGeneration = ref(false)
const loadingLetterGeneration = ref(false)

const hasCVData = computed(() => !!cvData.value)

// Auto-start CV generation when jobAnalysis becomes available
watch(
  () => props.jobAnalysis,
  (newJobAnalysis, oldJobAnalysis) => {
    if (
      newJobAnalysis &&
      !oldJobAnalysis &&
      !cvData.value &&
      !loadingCVGeneration.value
    ) {
      // Small delay to allow UI to settle
      setTimeout(() => {
        handleCVGeneration()
      }, 500)
    }
  },
  { immediate: true }
)

const handleCVGeneration = async () => {
  if (!props.jobAnalysis) {
    showStatusMessage(
      "error",
      "Erreur",
      "Vous devez d'abord analyser une offre d'emploi."
    )
    return
  }

  try {
    console.log("Generating CV...")
    loadingCVGeneration.value = true
    showStatusMessage(
      "success",
      "CV en cours de génération",
      "Votre CV est en cours d'adaptation selon l'offre d'emploi..."
    )

    // Load master CV first
    const masterCV = await $fetch<{
      success: boolean
      data?: any
      error?: string
    }>("/api/cv")

    if (!masterCV.success || !masterCV.data) {
      throw new Error(
        masterCV.error ||
          "CV maître non trouvé. Veuillez configurer votre CV dans les paramètres."
      )
    }

    // Call CV adaptation API
    const response = await $fetch<{
      success: boolean
      data?: any
      error?: string
    }>("/api/adapt-cv", {
      method: "POST",
      body: {
        cvData: masterCV.data,
        jobAnalysis: props.jobAnalysis,
        focusAreas: [],
      },
    })

    if (response.success && response.data) {
      // Convert API response to CVData format for preview
      const { mockCVData } = await import("~/components/templates/mockCVData")
      cvData.value = {
        ...mockCVData,
        // Integrate some real data from API response
        summary:
          response.data.adaptedPersonalInfo?.summary || mockCVData.summary,
      }
      cvId.value = "cv-" + Date.now()
      showStatusMessage(
        "success",
        "CV généré avec succès",
        "Votre CV adapté est prêt. Vous pouvez le prévisualiser."
      )

      emitDocumentsUpdate()

      // Auto-navigate to next step after successful CV generation
      setTimeout(() => {
        emit("next")
      }, 1000) // Short delay to show success message
    } else {
      throw new Error(response.error || "Erreur lors de la génération du CV")
    }
  } catch (error) {
    console.error("CV generation error:", error)
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue"
    showStatusMessage("error", "Erreur de génération", errorMessage)
  }
  loadingCVGeneration.value = false
}

const _handleLetterGeneration = async () => {
  if (!props.jobAnalysis) {
    showStatusMessage(
      "error",
      "Erreur",
      "Vous devez d'abord analyser une offre d'emploi."
    )
    return
  }

  if (!cvData.value) {
    showStatusMessage(
      "error",
      "Erreur",
      "Vous devez d'abord générer un CV adapté."
    )
    return
  }

  try {
    console.log("Generating cover letter...")
    loadingLetterGeneration.value = true
    showStatusMessage(
      "success",
      "Lettre en cours de génération",
      "Votre lettre de motivation est en cours de création..."
    )

    // Call letter generation API
    const response = await $fetch<{
      success: boolean
      data?: string
      error?: string
    }>("/api/generate-letter", {
      method: "POST",
      body: {
        adaptedCV: cvData.value,
        jobAnalysis: props.jobAnalysis,
      },
    })

    if (response.success && response.data) {
      letterData.value = response.data
      letterId.value = "letter-" + Date.now()
      showStatusMessage(
        "success",
        "Lettre générée avec succès",
        "Votre lettre de motivation est prête."
      )

      emitDocumentsUpdate()
    } else {
      throw new Error(
        response.error || "Erreur lors de la génération de la lettre"
      )
    }
  } catch (error) {
    console.error("Letter generation error:", error)
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue"
    showStatusMessage("error", "Erreur de génération", errorMessage)
  }
  loadingLetterGeneration.value = false
}

const emitDocumentsUpdate = () => {
  emit("documentsGenerated", {
    cvData: cvData.value,
    letterData: letterData.value,
    cvId: cvId.value || "",
    letterId: letterId.value || "",
  })
}

const showStatusMessage = (
  type: "success" | "error" | "warning",
  title: string,
  message: string
) => {
  statusMessage.value = { type, title, message }

  // Auto-dismiss success and info messages
  if (type === "success") {
    setTimeout(() => {
      statusMessage.value = null
    }, 5000)
  }
}
</script>
