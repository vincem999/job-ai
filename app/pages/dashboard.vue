<template>
  <div class="min-h-screen">
    <!-- Header Section -->
    <UHeader mode="drawer">
      <template #title><AppLogo /></template>

      <!-- <UNavigationMenu :items="items" /> -->
      <template #body>
        <UNavigationMenu :items="items" />
      </template>

      <template #right>
        <ColorModeButton />
      </template>
    </UHeader>

    <!-- Main Content -->
    <UMain
      class="p-6 bg-background-light dark:bg-background-dark"
      mode="slideover"
    >
      <div class="w-full flex justify-center">
        <div
          :class="currentStep === 0 ? 'w-[1000px] flex-col justify-center' : ''"
        >
          <div v-if="currentStep === 0" class="mb-8 max-w-[600px]">
            <h2 class="text-3xl font-extrabold mb-3">
              Générer des documents optimisés
            </h2>
            <p class="text-md">
              Analysez une offre d'emploi et générez un CV adapté avec une
              lettre de motivation personnalisée.
            </p>
          </div>
          <!-- Workflow Stepper -->
          <div class="my-15">
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
          <div
            class="mt-12 text-center text-sm text-gray-500 dark:text-gray-400"
          >
            <p>
              Optimisez vos candidatures avec l'IA •
              <NuxtLink to="/" class="text-primary">
                Retour à l'accueil
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </UMain>
  </div>
</template>

<script setup lang="ts">
import JobAnalysisStep from "~/components/dashboard/JobAnalysisStep.vue"
import DownloadStep from "~/components/dashboard/DownloadStep.vue"
import type { CV } from "../../types/cv"
import type { JobAnalysisResponse } from "../../types/ats"
import type { NavigationMenuItem } from "@nuxt/ui"

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

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "Accueil",
    to: "/",
    icon: "i-lucide-home",
  },
])

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
