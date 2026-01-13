<template>
  <UCard>
    <!-- Job Offer Input Section -->

    <template #header>
      <h3 class="text-2xl font-bold mb-2">Analyser l'offre d'emploi</h3>
      <p class="text-sm">
        Saisissez les détails de l'offre d'emploi pour commencer l'analyse
      </p>
    </template>

    <JobOfferInput :analyzing="isProcessing" @submit="handleJobSubmission" />

    <!-- Loading State -->
    <div v-if="isAnalyzing" class="mt-6">
      <div
        class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6"
      >
        <LoadingSpinner
          text="Analyse en cours de l'offre d'emploi..."
          color="text-blue-600 dark:text-blue-400"
          size="md"
        />
        <p class="text-sm text-blue-600 dark:text-blue-300 mt-3 text-center">
          Extraction des compétences requises et analyse des critères de
          sélection
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
        <UIcon
          name="i-heroicons-check-circle"
          class="w-4 h-4 inline text-green-500 mr-1"
        />
        Transition automatique vers l'étape suivante...
      </p>
    </div>
  </UCard>
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
  analysisComplete: [data: { analysis: any; cvData?: any }]
}>()

const jobAnalysis = ref(null)
const statusMessage = ref<StatusMessage | null>(null)
const isAnalyzing = ref(false)
const isProcessing = ref(false)

const hasJobAnalysis = computed(() => !!jobAnalysis.value)

const handleJobSubmission = async (jobData: JobOfferData) => {
  try {
    const { mockCVData } = await import("~/components/templates/mockCVData")
    // Start analyzing state
    isAnalyzing.value = true
    isProcessing.value = true
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
        cvData: mockCVData,
      },
    })

    if (response.success && response.data) {
      // Store the analyzed job data
      jobAnalysis.value = response.data

      // Stop analyzing state

      // Emit analysis completion with CV data
      emit("analysisComplete", {
        analysis: response.data,
        cvData: mockCVData,
      })

      isAnalyzing.value = false
      isProcessing.value = false
      emit("next")
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
    isProcessing.value = false
    showStatusMessage("error", "Erreur d'analyse", errorMessage)

    // Clear job analysis on error
    jobAnalysis.value = null
  }
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
