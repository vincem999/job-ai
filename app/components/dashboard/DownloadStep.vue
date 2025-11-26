<template>
  <div class="space-y-6">
    <!-- Download Section -->
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div class="mb-6">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
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

      <DocumentDownload :cv-data="cvData" :letter-data="letterData" />

      <!-- Navigation Buttons -->
      <div class="mt-8 flex justify-between">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-heroicons-arrow-left"
          @click="$emit('back')"
        >
          Retour à la génération
        </UButton>

        <UButton
          color="primary"
          size="lg"
          icon="i-heroicons-arrow-path"
          @click="handleRestart"
        >
          Nouveau processus
        </UButton>
      </div>
    </div>

    <!-- Summary Section -->
    <div
      class="bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 p-6"
    >
      <div class="flex items-start space-x-3">
        <UIcon
          name="i-heroicons-check-circle"
          class="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
        />
        <div>
          <h4
            class="text-lg font-semibold text-green-900 dark:text-green-100 mb-2"
          >
            Processus terminé avec succès !
          </h4>
          <p class="text-green-800 dark:text-green-200 text-sm mb-4">
            Vos documents ont été générés et sont prêts à être téléchargés.
          </p>

          <!-- Document Status -->
          <div class="space-y-2">
            <div v-if="cvData" class="flex items-center space-x-2 text-sm">
              <UIcon
                name="i-heroicons-document-text"
                class="w-4 h-4 text-green-600 dark:text-green-400"
              />
              <span class="text-green-800 dark:text-green-200"
                >CV adapté généré</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tips Section -->
    <div
      class="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6"
    >
      <div class="flex items-start space-x-3">
        <UIcon
          name="i-heroicons-light-bulb"
          class="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
        />
        <div>
          <h4
            class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2"
          >
            Conseils pour votre candidature
          </h4>
          <ul class="text-blue-800 dark:text-blue-200 text-sm space-y-1">
            <li>• Relisez attentivement votre CV adapté avant l'envoi</li>
            <li>• Personnalisez encore plus votre lettre si nécessaire</li>
            <li>• Vérifiez les coordonnées du recruteur</li>
            <li>
              • Préparez-vous aux questions d'entretien basées sur l'offre
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DocumentDownload from "~/components/dashboard/DocumentDownload.vue"
import type { AdaptedCV } from "../../../types/cv"
import type { CoverLetter } from "../../../types/api"

interface Props {
  cvData?: AdaptedCV
  letterData?: CoverLetter
}

defineProps<Props>()

const emit = defineEmits<{
  back: []
  restart: []
}>()

const handleRestart = () => {
  emit("restart")
}
</script>
