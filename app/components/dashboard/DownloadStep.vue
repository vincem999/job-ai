<template>
  <div class="space-y-6">
    <!-- Header ATS Score -->
    <div v-if="atsData" class="mb-6">
      <ATSScoreDisplay
        :score="atsData.score"
        :adaptation-needed="atsData.adaptationNeeded"
      />
    </div>
    <div class="grid sm:grid-cols-2 gap-4">
      <div>
        <ATSKeywordInsights v-if="atsData" :keywords="atsData.keywords" />
      </div>
      <div>
        <ATSSuggestions v-if="atsData" :suggestions="atsData.suggestions" />
      </div>
    </div>

    <!-- Download Section -->
    <UCard>
      <div class="mb-6">
        <h3 class="text-xl font-semibold mb-4">
          <UIcon
            name="i-heroicons-arrow-down-tray"
            class="w-5 h-5 inline mr-2"
          />
          Télécharger les documents
        </h3>

        <!-- Toggle entre Preview et Edition -->
        <div class="flex gap-4 mb-4">
          <UButton
            :variant="viewMode === 'preview' ? 'solid' : 'outline'"
            icon="i-heroicons-eye"
            @click="viewMode = 'preview'"
          >
            Aperçu
          </UButton>
          <UButton
            :variant="viewMode === 'edit' ? 'solid' : 'outline'"
            icon="i-heroicons-pencil"
            @click="viewMode = 'edit'"
          >
            Modifier expériences
          </UButton>
          <UButton
            :loading="isDownloadingCV"
            :disabled="isDownloadingCV"
            class="download-btn"
            icon="i-heroicons-arrow-down-tray"
            @click="downloadCV"
          >
            {{ isDownloadingCV ? "Téléchargement..." : "Télécharger CV" }}
          </UButton>
        </div>
      </div>

      <!-- Layout 2 colonnes -->
      <div class="grid sm:grid-flow-col auto-cols-fr gap-4">
        <!-- Colonne gauche: ATS Insights -->
        <div v-if="showEditor && editableCvData" class="relative h-full">
          <ExperienceEditor
            class="absolute top-0 left-0 right-0 bottom-0 overflow-y-auto"
            :cv-data="editableCvData"
            @update:cv-data="updateCV"
          />
        </div>

        <!-- CV Preview -->
        <div>
          <div class="sticky top-0 light:bg-neutral" style="width: 100%">
            <CVTemplate v-if="editableCvData" :cv-data="editableCvData" />
          </div>
        </div>
      </div>

      <!-- Actions footer -->
      <div class="flex justify-between items-center mt-8">
        <div class="flex gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-arrow-left"
            @click="$emit('back')"
          >
            Retour à l'analyse
          </UButton>
        </div>
      </div>
    </UCard>

    <!-- Summary Section -->
  </div>
</template>

<script setup lang="ts">
import CVTemplate from "~/components/templates/CVTemplate.vue"
import ExperienceEditor from "~/components/dashboard/ExperienceEditor.vue"
import ATSScoreDisplay from "~/components/dashboard/ATSScoreDisplay.vue"
import ATSKeywordInsights from "~/components/dashboard/ATSKeywordInsights.vue"
import ATSSuggestions from "~/components/dashboard/ATSSuggestions.vue"
import type { AdaptedCV, CV } from "../../../types/cv"
import type { ATSOptimization, JobAnalysisResponse } from "../../../types/ats"
import type { CoverLetter, ExportFormat } from "../../../types/api"

interface Props {
  cvData?: CV | AdaptedCV
  letterData?: CoverLetter
  jobAnalysis?: JobAnalysisResponse
  atsData?: ATSOptimization
}

const props = defineProps<Props>()

defineEmits<{
  back: []
}>()

const { generatePDF } = usePDFExport()

const viewMode = ref<"preview" | "edit">("preview")
const showEditor = ref(false)
const isDownloadingCV = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const editableCvData = ref<CV | AdaptedCV | undefined>(
  props.cvData ? { ...props.cvData } : undefined
)

// Watch pour synchroniser les props
watch(
  () => props.cvData,
  (newData) => {
    if (newData) {
      editableCvData.value = { ...newData }
    }
  },
  { deep: true, immediate: true }
)

const downloadCV = async () => {
  if (!props.cvData) return

  isDownloadingCV.value = true
  errorMessage.value = null

  try {
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

// Mise à jour du CV
const updateCV = (updatedCV: CV) => {
  editableCvData.value = updatedCV
}

// Synchroniser showEditor avec viewMode pour compatibilité
watch(viewMode, (newMode) => {
  showEditor.value = newMode === "edit"
})

watch(showEditor, (show) => {
  viewMode.value = show ? "edit" : "preview"
})
</script>
