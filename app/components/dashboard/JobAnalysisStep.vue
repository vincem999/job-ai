<template>
  <div class="space-y-6">
    <!-- Job Offer Input Section -->
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div class="mb-6">
        <h3
          class="text-xl font-semibold text-gray-900 dark:text-white mb-2"
        >
          <UIcon
            name="i-heroicons-clipboard-document-list"
            class="w-5 h-5 inline mr-2"
          />
          Analyser l'offre d'emploi
        </h3>
        <p class="text-gray-600 dark:text-gray-300 text-sm">
          Saisissez les détails de l'offre d'emploi pour commencer
          l'analyse
        </p>
      </div>

      <JobOfferInput
        @submit="handleJobSubmission"
        @clear="handleJobClear"
      />

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

      <!-- Next Step Button -->
      <div v-if="hasJobAnalysis" class="mt-6 flex justify-end">
        <UButton
          color="blue"
          size="lg"
          icon="i-heroicons-arrow-right"
          trailing
          @click="$emit('next')"
        >
          Continuer vers la génération
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import JobOfferInput from "~/components/dashboard/JobOfferInput.vue"

interface StatusMessage {
  type: "success" | "error" | "warning"
  title: string
  message: string
}

const emit = defineEmits<{
  next: []
  analysisComplete: [data: any]
}>()

const jobAnalysis = ref(null)
const statusMessage = ref<StatusMessage | null>(null)

const hasJobAnalysis = computed(() => !!jobAnalysis.value)

const handleJobSubmission = async (jobData: any) => {
  try {
    console.log("Job offer submitted:", jobData)

    showStatusMessage(
      "success",
      "Analyse en cours",
      "L'offre d'emploi est en cours d'analyse..."
    )

    // Call job analysis API
    const response = await $fetch<{
      success: boolean
      data?: any
      error?: string
    }>("/api/analyze-job", {
      method: "POST",
      body: {
        jobOffer: jobData.jobDescription || jobData.description || "",
        companyName: jobData.companyName || "",
        jobTitle: jobData.jobTitle || "",
      },
    })

    if (response.success && response.data) {
      // Store the analyzed job data
      jobAnalysis.value = response.data

      showStatusMessage(
        "success",
        "Offre d'emploi analysée",
        "L'analyse de l'offre d'emploi est terminée. Cliquez sur 'Continuer' pour passer à l'étape suivante."
      )

      // Emit analysis completion
      emit('analysisComplete', response.data)
    } else {
      throw new Error(
        response.error || "Erreur lors de l'analyse de l'offre d'emploi"
      )
    }
  } catch (error) {
    console.error("Job analysis error:", error)
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue"
    showStatusMessage("error", "Erreur d'analyse", errorMessage)

    // Clear job analysis on error
    jobAnalysis.value = null
  }
}

const handleJobClear = () => {
  jobAnalysis.value = null
  statusMessage.value = null
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