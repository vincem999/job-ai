<template>
  <section
    id="demo"
    class="py-25 border-bottom border-white dark:border-white/5"
  >
    <UContainer>
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Voyez-le en action
        </h2>
        <p
          class="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
        >
          Regardez comment notre IA analyse les offres d'emploi et génère des
          documents adaptés en trois étapes simples
        </p>
      </div>

      <!-- Interactive Demo Steps -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <!-- Step 1: Upload Job Offer -->
        <UCard
          :class="[
            'transition-all duration-300 cursor-pointer border-2',
            activeStep === 1
              ? 'border-primary-500 shadow-lg scale-105'
              : 'border-gray-200 dark:border-gray-700 hover:border-primary-300',
          ]"
          @click="setActiveStep(1)"
        >
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold',
                    activeStep === 1
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
                  ]"
                >
                  1
                </div>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  L'offre d'emploi
                </h3>
              </div>
            </div>
          </template>

          <template #default>
            <div class="space-y-3">
              <div
                class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <UIcon
                  name="i-lucide-upload"
                  class="w-4 h-4 text-primary-600"
                />
                <span>Copier-coller la description du poste</span>
              </div>
              <div
                class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <UIcon name="i-lucide-brain" class="w-4 h-4 text-primary-600" />
                <span>L'IA analyse les exigences</span>
              </div>
              <div
                class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <UIcon
                  name="i-lucide-check-circle"
                  class="w-4 h-4 text-primary-600"
                />
                <span>Extraire les compétences clés et qualifications</span>
              </div>
            </div>
          </template>
        </UCard>

        <!-- Step 2: Generate Documents -->
        <UCard
          :class="[
            'transition-all duration-300 cursor-pointer border-2',
            activeStep === 2
              ? 'border-primary-500 shadow-lg scale-105'
              : 'border-gray-200 dark:border-gray-700 hover:border-primary-300',
          ]"
          @click="setActiveStep(2)"
        >
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold',
                    activeStep === 2
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
                  ]"
                >
                  2
                </div>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Génération IA
                </h3>
              </div>
            </div>
          </template>

          <template #default>
            <div class="space-y-3">
              <div
                class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <UIcon
                  name="i-lucide-file-text"
                  class="w-4 h-4 text-primary-600"
                />
                <span>Adapter le CV aux exigences du poste</span>
              </div>
              <div
                class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <UIcon
                  name="i-lucide-pen-tool"
                  class="w-4 h-4 text-primary-600"
                />
                <span>Générer une lettre de motivation</span>
              </div>
              <div
                class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <UIcon
                  name="i-lucide-sparkles"
                  class="w-4 h-4 text-primary-600"
                />
                <span>Mettre en valeur l'expérience pertinente</span>
              </div>
            </div>
          </template>
        </UCard>

        <!-- Step 3: Download -->
        <UCard
          :class="[
            'transition-all duration-300 cursor-pointer border-2',
            activeStep === 3
              ? 'border-primary-500 shadow-lg scale-105'
              : 'border-gray-200 dark:border-gray-700 hover:border-primary-300',
          ]"
          @click="setActiveStep(3)"
        >
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold',
                    activeStep === 3
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
                  ]"
                >
                  3
                </div>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Exporter et postuler
                </h3>
              </div>
            </div>
          </template>

          <template #default>
            <div class="space-y-3">
              <div
                class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <UIcon
                  name="i-lucide-download"
                  class="w-4 h-4 text-primary-600"
                />
                <span>Télécharger les documents PDF</span>
              </div>
              <div
                class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <UIcon
                  name="i-lucide-printer"
                  class="w-4 h-4 text-primary-600"
                />
                <span>Formatage prêt à imprimer</span>
              </div>
              <div
                class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <UIcon name="i-lucide-send" class="w-4 h-4 text-primary-600" />
                <span>Prêt pour les candidatures</span>
              </div>
            </div>
          </template>
        </UCard>
      </div>

      <!-- Demo Preview Area -->
      <UCard class="">
        <div class="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ currentStep.title }}
            </h3>
            <UBadge :color="currentStep.badgeColor" variant="subtle">
              {{ currentStep.badge }}
            </UBadge>
          </div>
        </div>

        <div class="p-6">
          <div class="relative min-h-64">
            <!-- Step 1 Content: Job Offer Input -->
            <div v-if="activeStep === 1" class="space-y-4">
              <div class="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4">
                <div class="flex items-start space-x-3">
                  <UIcon
                    name="i-lucide-briefcase"
                    class="w-5 h-5 text-primary-600 mt-1"
                  />
                  <div class="flex-1">
                    <h4
                      class="font-semibold text-gray-900 dark:text-white mb-2"
                    >
                      Développeur Frontend - Vue.js
                    </h4>
                    <div
                      class="text-sm text-gray-600 dark:text-gray-400 space-y-1"
                    >
                      <p>• 3+ ans d'expérience avec Vue.js et TypeScript</p>
                      <p>
                        • Solide connaissance de Tailwind CSS et design
                        responsive
                      </p>
                      <p>• Expérience avec le framework Nuxt.js préférée</p>
                      <p>• Connaissance des API REST et GraphQL</p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400"
              >
                <UIcon name="i-lucide-check-circle" class="w-4 h-4" />
                <span>Exigences du poste analysées avec succès</span>
              </div>
            </div>

            <!-- Step 2 Content: AI Processing -->
            <div v-if="activeStep === 2" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4">
                  <div class="flex items-center space-x-2 mb-3">
                    <UIcon
                      name="i-lucide-file-text"
                      class="w-5 h-5 text-primary-600"
                    />
                    <h4 class="font-semibold text-blue-900 dark:text-blue-300">
                      Adaptation du CV
                    </h4>
                  </div>
                  <div
                    class="text-sm text-blue-700 dark:text-blue-300 space-y-1"
                  >
                    <p>✓ Expérience Vue.js & TypeScript mise en avant</p>
                    <p>✓ Projets de design responsive soulignés</p>
                    <p>✓ Exemples de projets Nuxt.js ajoutés</p>
                  </div>
                </div>
                <div class="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4">
                  <div class="flex items-center space-x-2 mb-3">
                    <UIcon
                      name="i-lucide-pen-tool"
                      class="w-5 h-5 text-primary-600"
                    />
                    <h4
                      class="font-semibold text-purple-900 dark:text-purple-300"
                    >
                      Lettre de motivation
                    </h4>
                  </div>
                  <div
                    class="text-sm text-purple-700 dark:text-purple-300 space-y-1"
                  >
                    <p>✓ Introduction personnalisée rédigée</p>
                    <p>✓ Compétences adaptées aux exigences du poste</p>
                    <p>✓ Recherche sur l'entreprise intégrée</p>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2 text-sm">
                <div class="flex items-center space-x-1">
                  <div
                    class="w-2 h-2 bg-primary-600 rounded-full animate-pulse"
                  />
                  <span class="text-gray-600 dark:text-gray-400"
                    >Traitement IA terminé</span
                  >
                </div>
              </div>
            </div>

            <!-- Step 3 Content: Export -->
            <div v-if="activeStep === 3" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  class="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4 flex items-center space-x-3"
                >
                  <div class="shrink-0">
                    <div
                      class="w-12 h-16 rounded flex items-center justify-center"
                    >
                      <UIcon
                        name="i-lucide-file-text"
                        class="w-6 h-6 text-primary-600"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 dark:text-white">
                      CV adapté
                    </h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      PDF professionnel • 2 pages
                    </p>
                    <UButton size="xs" variant="outline" class="mt-2">
                      <UIcon name="i-lucide-download" class="w-3 h-3" />
                      Télécharger
                    </UButton>
                  </div>
                </div>
                <div
                  class="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4 flex items-center space-x-3"
                >
                  <div class="shrink-0">
                    <div class="w-12 h-16 flex items-center justify-center">
                      <UIcon
                        name="i-lucide-mail"
                        class="w-6 h-6 text-primary-600"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 dark:text-white">
                      Lettre de motivation
                    </h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      PDF professionnel • 1 page
                    </p>
                    <UButton size="xs" variant="outline" class="mt-2">
                      <UIcon name="i-lucide-download" class="w-3 h-3" />
                      Télécharger
                    </UButton>
                  </div>
                </div>
              </div>
              <div class="text-center pt-4">
                <div class="flex">
                  <UButton size="lg" to="/dashboard">
                    Démarrer votre candidature
                    <template #trailing>
                      <UIcon name="i-lucide-arrow-right" />
                    </template>
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Auto-advance feature -->
      <div class="text-center mt-8">
        <div class="flex items-center justify-center space-x-4">
          <UButton
            :disabled="activeStep === 1"
            variant="outline"
            @click="previousStep"
          >
            <UIcon name="i-lucide-chevron-left" />
            Précédent
          </UButton>

          <div class="flex space-x-2">
            <div
              v-for="step in 3"
              :key="step"
              :class="[
                'w-2 h-2 rounded-full transition-colors duration-300',
                step === activeStep
                  ? 'bg-primary-600'
                  : 'bg-gray-300 dark:bg-gray-600',
              ]"
            />
          </div>

          <UButton
            :disabled="activeStep === 3"
            variant="outline"
            @click="nextStep"
          >
            Suivant
            <UIcon name="i-lucide-chevron-right" />
          </UButton>
        </div>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
// Demo component for showcasing the CV optimization process

const activeStep = ref(1)
const isAutoPlay = ref(false)
const autoPlayInterval = ref<NodeJS.Timeout | null>(null)

// Computed property to safely get current step
const currentStep = computed(
  () => demoSteps[activeStep.value - 1] || demoSteps[0]
)

const demoSteps = [
  {
    title: "Analyse de l'offre d'emploi",
    badge: "Propulsé par IA",
    badgeColor: "info" as const,
  },
  {
    title: "Génération de documents",
    badge: "Traitement en cours",
    badgeColor: "primary" as const,
  },
  {
    title: "Prêt pour téléchargement",
    badge: "Terminé",
    badgeColor: "success" as const,
  },
] as const

const setActiveStep = (step: number) => {
  activeStep.value = step
}

const nextStep = () => {
  if (activeStep.value < 3) {
    activeStep.value++
  } else if (isAutoPlay.value) {
    activeStep.value = 1
  }
}

const previousStep = () => {
  if (activeStep.value > 1) {
    activeStep.value--
  }
}

const toggleAutoPlay = () => {
  isAutoPlay.value = !isAutoPlay.value

  if (isAutoPlay.value) {
    startAutoPlay()
  } else {
    stopAutoPlay()
  }
}

const startAutoPlay = () => {
  autoPlayInterval.value = setInterval(() => {
    nextStep()
  }, 4000) // Change step every 4 seconds
}

const stopAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value)
    autoPlayInterval.value = null
  }
}

// Cleanup on unmount
onUnmounted(() => {
  stopAutoPlay()
})
</script>
