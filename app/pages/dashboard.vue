<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header Section -->
    <header
      class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo and Title -->
          <div class="flex items-center space-x-4">
            <UIcon name="i-heroicons-briefcase" class="w-8 h-8 text-blue-600" />
            <div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">
                CV Optimizer
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Tableau de bord
              </p>
            </div>
          </div>

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

            <!-- Color Mode Toggle -->
            <UButton
              variant="ghost"
              color="neutral"
              icon="i-heroicons-sun"
              :aria-label="
                $colorMode.preference === 'dark'
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
              "
              @click="
                $colorMode.preference =
                  $colorMode.preference === 'dark' ? 'light' : 'dark'
              "
            />
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

      <!-- Workflow Steps -->
      <div class="mb-8">
        <div
          class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400"
        >
          <div class="flex items-center">
            <div
              class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold"
            >
              1
            </div>
            <span class="ml-2">Analyser l'offre</span>
          </div>
          <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
          <div class="flex items-center">
            <div
              class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 flex items-center justify-center text-xs font-semibold"
            >
              2
            </div>
            <span class="ml-2">Générer les documents</span>
          </div>
          <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
          <div class="flex items-center">
            <div
              class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 flex items-center justify-center text-xs font-semibold"
            >
              3
            </div>
            <span class="ml-2">Télécharger</span>
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <!-- Left Column: Job Input and Generation -->
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
          </div>

          <!-- Generation Controls -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div class="mb-6">
              <h3
                class="text-xl font-semibold text-gray-900 dark:text-white mb-2"
              >
                <UIcon
                  name="i-heroicons-cog-6-tooth"
                  class="w-5 h-5 inline mr-2"
                />
                Générer les documents
              </h3>
              <p class="text-gray-600 dark:text-gray-300 text-sm">
                Créez votre CV adapté et votre lettre de motivation
              </p>
            </div>

            <div class="space-y-4">
              <GenerateButton
                :disabled="!hasJobAnalysis"
                type="cv"
                @generate="handleCVGeneration"
              >
                Générer le CV adapté
              </GenerateButton>

              <GenerateButton
                :disabled="!hasJobAnalysis || !hasCVData"
                type="letter"
                @generate="handleLetterGeneration"
              >
                Générer la lettre de motivation
              </GenerateButton>
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
          </div>
        </div>

        <!-- Right Column: Preview and Download -->
        <div class="space-y-6">
          <!-- CV Preview Section -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div class="mb-6">
              <h3
                class="text-xl font-semibold text-gray-900 dark:text-white mb-2"
              >
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

          <!-- Download Section -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div class="mb-6">
              <h3
                class="text-xl font-semibold text-gray-900 dark:text-white mb-2"
              >
                <UIcon
                  name="i-heroicons-arrow-down-tray"
                  class="w-5 h-5 inline mr-2"
                />
                Télécharger les documents
              </h3>
              <p class="text-gray-600 dark:text-gray-300 text-sm">
                Téléchargez vos documents dans différents formats
              </p>
            </div>

            <DocumentDownload
              :cv-data="cvData as any"
              :letter-data="letterData"
              :cv-id="cvId"
              :letter-id="letterId"
            />
          </div>
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
    </main>
  </div>
</template>

<script setup lang="ts">
import JobOfferInput from "~/components/dashboard/JobOfferInput.vue"
import GenerateButton from "~/components/dashboard/GenerateButton.vue"
import CVPreview from "~/components/dashboard/CVPreview.vue"
import DocumentDownload from "~/components/dashboard/DocumentDownload.vue"
import type { CVData } from "~/components/templates/mockCVData"

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

const jobAnalysis = ref(null)
const cvData = ref<CVData | undefined>(undefined)
const letterData = ref<any | undefined>(undefined)
const cvId = ref<string | undefined>(undefined)
const letterId = ref<string | undefined>(undefined)
const statusMessage = ref<{
  type: "success" | "error" | "warning"
  title: string
  message: string
} | null>(null)

const hasJobAnalysis = computed(() => !!jobAnalysis.value)
const hasCVData = computed(() => !!cvData.value)

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
    }>('/api/analyze-job', {
      method: 'POST',
      body: {
        jobOffer: jobData.jobDescription || jobData.description || '',
        companyName: jobData.companyName || '',
        jobTitle: jobData.jobTitle || ''
      }
    })

    if (response.success && response.data) {
      // Store the analyzed job data
      jobAnalysis.value = response.data

      showStatusMessage(
        "success",
        "Offre d'emploi analysée",
        "L'analyse de l'offre d'emploi est terminée. Vous pouvez maintenant générer votre CV adapté."
      )
    } else {
      throw new Error(response.error || 'Erreur lors de l\'analyse de l\'offre d\'emploi')
    }

  } catch (error) {
    console.error('Job analysis error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    showStatusMessage(
      "error",
      "Erreur d'analyse",
      errorMessage
    )

    // Clear job analysis on error
    jobAnalysis.value = null
  }
}

const handleJobClear = () => {
  jobAnalysis.value = null
  cvData.value = undefined
  letterData.value = undefined
  cvId.value = undefined
  letterId.value = undefined
  statusMessage.value = null
}

const handleCVGeneration = async () => {
  if (!jobAnalysis.value) {
    showStatusMessage(
      "error",
      "Erreur",
      "Vous devez d'abord analyser une offre d'emploi."
    )
    return
  }

  try {
    console.log("Generating CV...")
    showStatusMessage(
      "success",
      "CV en cours de génération",
      "Votre CV est en cours d'adaptation selon l'offre d'emploi..."
    )

    // Load master CV first
    // TODO: Integrate useCV composable properly
    const masterCV = await $fetch<{
      success: boolean
      data?: any
      error?: string
    }>('/api/cv')

    if (!masterCV.success || !masterCV.data) {
      throw new Error(masterCV.error || 'CV maître non trouvé. Veuillez configurer votre CV dans les paramètres.')
    }

    // Call CV adaptation API
    const response = await $fetch<{
      success: boolean
      data?: any
      error?: string
    }>('/api/adapt-cv', {
      method: 'POST',
      body: {
        cvData: masterCV.data,
        jobAnalysis: jobAnalysis.value,
        focusAreas: []
      }
    })

    if (response.success && response.data) {
      // Convert API response to CVData format for preview
      // For now, we'll use mock data but with real API structure
      import("~/components/templates/mockCVData").then(({ mockCVData }) => {
        cvData.value = {
          ...mockCVData,
          // Integrate some real data from API response
          summary: response.data.adaptedPersonalInfo?.summary || mockCVData.summary
        }
        cvId.value = "cv-" + Date.now()
        showStatusMessage(
          "success",
          "CV généré avec succès",
          "Votre CV adapté est prêt. Vous pouvez le prévisualiser et le télécharger."
        )
      })
    } else {
      throw new Error(response.error || 'Erreur lors de la génération du CV')
    }

  } catch (error) {
    console.error('CV generation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    showStatusMessage(
      "error",
      "Erreur de génération",
      errorMessage
    )
  }
}

const handleLetterGeneration = async () => {
  if (!jobAnalysis.value) {
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
    }>('/api/generate-letter', {
      method: 'POST',
      body: {
        adaptedCV: cvData.value,
        jobAnalysis: jobAnalysis.value
      }
    })

    if (response.success && response.data) {
      letterData.value = response.data
      letterId.value = "letter-" + Date.now()
      showStatusMessage(
        "success",
        "Lettre générée avec succès",
        "Votre lettre de motivation est prête. Vous pouvez la télécharger."
      )
    } else {
      throw new Error(response.error || 'Erreur lors de la génération de la lettre')
    }

  } catch (error) {
    console.error('Letter generation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    showStatusMessage(
      "error",
      "Erreur de génération",
      errorMessage
    )
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

// Auto-dismiss status messages when user interacts
watch([jobAnalysis, cvData, letterData], () => {
  if (statusMessage.value?.type === "success") {
    setTimeout(() => {
      statusMessage.value = null
    }, 3000)
  }
})
</script>

<style scoped>
/* Additional custom styles if needed */
.grid {
  /* Ensure grid columns are balanced */
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
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
