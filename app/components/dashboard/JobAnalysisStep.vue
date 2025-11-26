<template>
  <div class="space-y-6">
    <!-- Job Offer Input Section -->
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div class="mb-6">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          <UIcon
            name="i-heroicons-clipboard-document-list"
            class="w-5 h-5 inline mr-2"
          />
          Analyser l'offre d'emploi
        </h3>
        <p class="text-gray-600 dark:text-gray-300 text-sm">
          Saisissez les détails de l'offre d'emploi pour commencer l'analyse
        </p>
      </div>

      <JobOfferInput @submit="handleJobSubmission" @clear="handleJobClear" />

      <!-- Loading State -->
      <div v-if="isAnalyzing" class="mt-6">
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
          <LoadingSpinner
            text="Analyse en cours de l'offre d'emploi..."
            color="text-blue-600 dark:text-blue-400"
            size="md"
          />
          <p class="text-sm text-blue-600 dark:text-blue-300 mt-3 text-center">
            Extraction des compétences requises et analyse des critères de sélection
          </p>
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

      <!-- Auto-transition notification -->
      <div v-if="hasJobAnalysis" class="mt-6 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-300">
          <UIcon name="i-heroicons-check-circle" class="w-4 h-4 inline text-green-500 mr-1" />
          Transition automatique vers l'étape suivante...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import JobOfferInput from "~/components/dashboard/JobOfferInput.vue"
import LoadingSpinner from "~/components/dashboard/LoadingSpinner.vue"

interface StatusMessage {
  type: "success" | "error" | "warning"
  title: string
  message: string
}

interface JobOfferData {
  title: string
  company: string
  description: string
}

const emit = defineEmits<{
  next: []
  analysisComplete: [data: any]
}>()

const jobAnalysis = ref(null)
const statusMessage = ref<StatusMessage | null>(null)
const isAnalyzing = ref(false)

const hasJobAnalysis = computed(() => !!jobAnalysis.value)

const handleJobSubmission = async (jobData: JobOfferData) => {
  try {
    console.log("Job offer submitted:", jobData)

    // Start analyzing state
    isAnalyzing.value = true
    statusMessage.value = null // Clear any previous status messages

    // Call job analysis API
    const response = await $fetch<{
      success: boolean
      data?: any
      error?: string
    }>("/api/analyze-job", {
      method: "POST",
      body: {
        jobOffer: jobData.description,
        company: jobData.company,
        position: jobData.title,
      },
    })

    if (response.success && response.data) {
      // Store the analyzed job data
      jobAnalysis.value = response.data

      // Stop analyzing state
      isAnalyzing.value = false

      showStatusMessage(
        "success",
        "Offre d'emploi analysée",
        "L'analyse de l'offre d'emploi est terminée. Transition automatique vers l'étape suivante..."
      )

      // Emit analysis completion
      emit("analysisComplete", response.data)

      // Auto-transition to next step
      setTimeout(() => {
        emit("next")
      }, 1500) // Petite pause pour permettre à l'utilisateur de voir le message de succès
    } else {
      throw new Error(
        response.error || "Erreur lors de l'analyse de l'offre d'emploi"
      )
    }
  } catch (error) {
    console.error("Job analysis error:", error)
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue"

    // Stop analyzing state
    isAnalyzing.value = false

    showStatusMessage("error", "Erreur d'analyse", errorMessage)

    // Clear job analysis on error
    jobAnalysis.value = null
  }
}

const handleJobClear = () => {
  jobAnalysis.value = null
  statusMessage.value = null
  isAnalyzing.value = false
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
