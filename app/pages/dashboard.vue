<template>
  <div class="min-h-screen">
    <!-- Header Section -->
    <header
      class="bg-white dark:bg-elevated border-b light:border-gray-200 dark:border-neutral-700"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo and Title -->
          <div class="flex items-center space-x-4"/>

          <!-- Navigation Actions -->
          <div class="flex items-center space-x-4">
            <UButton
              to="/"
              variant="ghost"
              color="neutral"
              icon="i-heroicons-home"
            >
              Accueil
            </UButton>
            <ColorModeButton />
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <UMain class="p-6">
      <!-- Page Title and Description -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Générer des documents optimisés
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Analysez une offre d'emploi et générez un CV adapté avec une lettre de
          motivation personnalisée
        </p>
      </div>

      <!-- Workflow Stepper -->
      <div class="mb-8">
        <UStepper
          id="stepper"
          :model-value="currentStep"
          :items="workflowSteps"
          disabled
          color="primary"
          size="sm"
        />
      </div>

      <!-- Step Content -->
      <div class="min-h-96">
        <!-- Step 1: Job Analysis -->
        <div v-if="currentStep === 0">
          <JobAnalysisStep
            @next="goToStep(1)"
            @analysis-complete="handleAnalysisComplete"
          />
        </div>

        <!-- Step 2: Download (bypassing Document Generation) -->
        <div v-else-if="currentStep === 1">
          <DownloadStep
            :cv-data="cvData"
            :job-analysis="jobAnalysis"
            :letter-data="letterData"
            :ats-data="jobAnalysis?.atsOptimization"
            :cv-id="cvId"
            :letter-id="letterId"
            @back="goToStep(0)"
            @restart="handleRestart"
          />
        </div>
      </div>

      <!-- Footer Section -->
      <div class="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Optimisez vos candidatures avec l'IA •
          <NuxtLink
            to="/"
            class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Retour à l'accueil
          </NuxtLink>
        </p>
      </div>
    </UMain>
  </div>
</template>

<script setup lang="ts">
import JobAnalysisStep from "~/components/dashboard/JobAnalysisStep.vue"
import DownloadStep from "~/components/dashboard/DownloadStep.vue"
import type { CV } from "../../types/cv"
import type { JobAnalysisResponse } from "../../types/ats"

// Page metadata
useHead({
  title: "Dashboard - CV Optimizer",
  meta: [
    {
      name: "description",
      content:
        "Générez des CV optimisés et des lettres de motivation personnalisées basées sur l'analyse d'offres d'emploi",
    },
  ],
})

// Workflow state
const currentStep = ref(0)
const jobAnalysis = ref<JobAnalysisResponse | undefined>(undefined)
const cvData = ref<CV | undefined>(undefined)
const letterData = ref<any | undefined>(undefined)
const cvId = ref<string | undefined>(undefined)
const letterId = ref<string | undefined>(undefined)

// Workflow steps configuration
const workflowSteps = [
  {
    title: "Analyser l'offre",
    description: "Analyse de l'offre d'emploi",
    icon: "i-heroicons-document-magnifying-glass",
  },
  {
    title: "Optimiser et télécharger",
    description: "Optimisation ATS et téléchargement",
    icon: "i-heroicons-arrow-down-tray",
  },
]

// Navigation functions
const goToStep = (step: number) => {
  currentStep.value = step
}

// Step event handlers
const handleAnalysisComplete = (data: {
  analysis: JobAnalysisResponse
  cvData?: CV
}) => {
  if (data.analysis) {
    jobAnalysis.value = data.analysis
    // If CV data was provided during analysis, store it
    if (data.cvData) {
      cvData.value = data.cvData
    }
  }
}

const handleRestart = () => {
  // Reset all state
  currentStep.value = 0
  jobAnalysis.value = undefined
  cvData.value = undefined
  letterData.value = undefined
  cvId.value = undefined
  letterId.value = undefined
}
</script>

<style scoped>
/* Additional custom styles if needed */
.grid {
  /* Ensure grid columns are balanced */
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
}

#stepper :deep(button) {
  cursor: auto !important;
}

@media (min-width: 1280px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* Smooth transitions */
.transition-all {
  transition: all 0.3s ease;
}
</style>
