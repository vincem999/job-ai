<template>
  <section id="demo" class="py-16 bg-gray-50 dark:bg-gray-900">
    <UContainer>
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          See It In Action
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Watch how our AI analyzes job offers and generates tailored documents in three simple steps
        </p>
      </div>

      <!-- Interactive Demo Steps -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <!-- Step 1: Upload Job Offer -->
        <UCard
          :class="[
            'transition-all duration-300 cursor-pointer border-2',
            activeStep === 1 ? 'border-primary-500 shadow-lg scale-105' : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
          ]"
          @click="setActiveStep(1)"
        >
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div
:class="[
                  'w-10 h-10 rounded-full flex items-center justify-center font-bold',
                  activeStep === 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                ]">
                  1
                </div>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Upload Job Offer
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Paste or upload the job description
                </p>
              </div>
            </div>
          </template>

          <template #default>
            <div class="space-y-3">
              <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <UIcon name="i-lucide-upload" class="w-4 h-4 text-primary-600" />
                <span>Copy & paste job description</span>
              </div>
              <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <UIcon name="i-lucide-brain" class="w-4 h-4 text-primary-600" />
                <span>AI analyzes requirements</span>
              </div>
              <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <UIcon name="i-lucide-check-circle" class="w-4 h-4 text-primary-600" />
                <span>Extract key skills & qualifications</span>
              </div>
            </div>
          </template>
        </UCard>

        <!-- Step 2: Generate Documents -->
        <UCard
          :class="[
            'transition-all duration-300 cursor-pointer border-2',
            activeStep === 2 ? 'border-primary-500 shadow-lg scale-105' : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
          ]"
          @click="setActiveStep(2)"
        >
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div
:class="[
                  'w-10 h-10 rounded-full flex items-center justify-center font-bold',
                  activeStep === 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                ]">
                  2
                </div>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  AI Generation
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Smart document adaptation
                </p>
              </div>
            </div>
          </template>

          <template #default>
            <div class="space-y-3">
              <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <UIcon name="i-lucide-file-text" class="w-4 h-4 text-primary-600" />
                <span>Adapt CV to job requirements</span>
              </div>
              <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <UIcon name="i-lucide-pen-tool" class="w-4 h-4 text-primary-600" />
                <span>Generate cover letter</span>
              </div>
              <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <UIcon name="i-lucide-sparkles" class="w-4 h-4 text-primary-600" />
                <span>Highlight relevant experience</span>
              </div>
            </div>
          </template>
        </UCard>

        <!-- Step 3: Download -->
        <UCard
          :class="[
            'transition-all duration-300 cursor-pointer border-2',
            activeStep === 3 ? 'border-primary-500 shadow-lg scale-105' : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
          ]"
          @click="setActiveStep(3)"
        >
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div
:class="[
                  'w-10 h-10 rounded-full flex items-center justify-center font-bold',
                  activeStep === 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                ]">
                  3
                </div>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Export & Apply
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Professional PDF output
                </p>
              </div>
            </div>
          </template>

          <template #default>
            <div class="space-y-3">
              <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <UIcon name="i-lucide-download" class="w-4 h-4 text-primary-600" />
                <span>Download PDF documents</span>
              </div>
              <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <UIcon name="i-lucide-printer" class="w-4 h-4 text-primary-600" />
                <span>Print-ready formatting</span>
              </div>
              <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <UIcon name="i-lucide-send" class="w-4 h-4 text-primary-600" />
                <span>Ready for job applications</span>
              </div>
            </div>
          </template>
        </UCard>
      </div>

      <!-- Demo Preview Area -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
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
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div class="flex items-start space-x-3">
                  <UIcon name="i-lucide-briefcase" class="w-5 h-5 text-primary-600 mt-1" />
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-2">
                      Frontend Developer - Vue.js
                    </h4>
                    <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p>• 3+ years experience with Vue.js and TypeScript</p>
                      <p>• Strong knowledge of Tailwind CSS and responsive design</p>
                      <p>• Experience with Nuxt.js framework preferred</p>
                      <p>• Knowledge of REST APIs and GraphQL</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                <UIcon name="i-lucide-check-circle" class="w-4 h-4" />
                <span>Job requirements analyzed successfully</span>
              </div>
            </div>

            <!-- Step 2 Content: AI Processing -->
            <div v-if="activeStep === 2" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div class="flex items-center space-x-2 mb-3">
                    <UIcon name="i-lucide-file-text" class="w-5 h-5 text-blue-600" />
                    <h4 class="font-semibold text-blue-900 dark:text-blue-300">CV Adaptation</h4>
                  </div>
                  <div class="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <p>✓ Highlighted Vue.js & TypeScript experience</p>
                    <p>✓ Emphasized responsive design projects</p>
                    <p>✓ Added Nuxt.js project examples</p>
                  </div>
                </div>
                <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <div class="flex items-center space-x-2 mb-3">
                    <UIcon name="i-lucide-pen-tool" class="w-5 h-5 text-purple-600" />
                    <h4 class="font-semibold text-purple-900 dark:text-purple-300">Cover Letter</h4>
                  </div>
                  <div class="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                    <p>✓ Personalized introduction written</p>
                    <p>✓ Skills matched to job requirements</p>
                    <p>✓ Company research incorporated</p>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2 text-sm">
                <div class="flex items-center space-x-1">
                  <div class="w-2 h-2 bg-primary-600 rounded-full animate-pulse"/>
                  <span class="text-gray-600 dark:text-gray-400">AI processing complete</span>
                </div>
              </div>
            </div>

            <!-- Step 3 Content: Export -->
            <div v-if="activeStep === 3" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-12 h-16 bg-red-100 dark:bg-red-900 rounded border-2 border-red-200 dark:border-red-700 flex items-center justify-center">
                      <UIcon name="i-lucide-file-text" class="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 dark:text-white">Adapted CV</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Professional PDF • 2 pages</p>
                    <UButton size="xs" variant="outline" class="mt-2">
                      <UIcon name="i-lucide-download" class="w-3 h-3" />
                      Download
                    </UButton>
                  </div>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-12 h-16 bg-blue-100 dark:bg-blue-900 rounded border-2 border-blue-200 dark:border-blue-700 flex items-center justify-center">
                      <UIcon name="i-lucide-mail" class="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 dark:text-white">Cover Letter</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Professional PDF • 1 page</p>
                    <UButton size="xs" variant="outline" class="mt-2">
                      <UIcon name="i-lucide-download" class="w-3 h-3" />
                      Download
                    </UButton>
                  </div>
                </div>
              </div>
              <div class="text-center pt-4">
                <UButton size="lg" to="/dashboard">
                  Start Your Application
                  <template #trailing>
                    <UIcon name="i-lucide-arrow-right" />
                  </template>
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Auto-advance feature -->
      <div class="text-center mt-8">
        <div class="flex items-center justify-center space-x-4">
          <UButton
            :disabled="activeStep === 1"
            variant="outline"
            @click="previousStep"
          >
            <UIcon name="i-lucide-chevron-left" />
            Previous
          </UButton>

          <div class="flex space-x-2">
            <div
              v-for="step in 3"
              :key="step"
              :class="[
                'w-2 h-2 rounded-full transition-colors duration-300',
                step === activeStep ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              ]"
            />
          </div>

          <UButton
            :disabled="activeStep === 3"
            variant="outline"
            @click="nextStep"
          >
            Next
            <UIcon name="i-lucide-chevron-right" />
          </UButton>
        </div>

        <div class="mt-4">
          <UButton
            variant="ghost"
            class="text-sm"
            @click="toggleAutoPlay"
          >
            <UIcon :name="isAutoPlay ? 'i-lucide-pause' : 'i-lucide-play'" class="w-3 h-3" />
            {{ isAutoPlay ? 'Pause' : 'Auto-play' }} Demo
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
const currentStep = computed(() => demoSteps[activeStep.value - 1] || demoSteps[0])

const demoSteps = [
  {
    title: 'Job Offer Analysis',
    badge: 'AI Powered',
    badgeColor: 'info' as const
  },
  {
    title: 'Document Generation',
    badge: 'Processing',
    badgeColor: 'primary' as const
  },
  {
    title: 'Ready for Download',
    badge: 'Complete',
    badgeColor: 'success' as const
  }
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