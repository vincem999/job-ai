<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
    <UContainer class="py-24 lg:py-32">
      <div class="mx-auto max-w-4xl text-center">
        <UBadge
          color="primary"
          variant="subtle"
          size="lg"
          class="mb-8"
        >
          🚀 Optimize Your Job Applications with AI
        </UBadge>

        <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
          Transform Your CV for Every
          <span class="text-primary-600 dark:text-primary-400"> Job Opportunity</span>
        </h1>

        <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
          Leverage AI to analyze job offers and automatically adapt your CV to match requirements perfectly.
          Generate compelling cover letters and export professional documents instantly.
        </p>

        <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            size="xl"
            class="px-8 py-4"
            to="/dashboard"
          >
            Get Started Free
            <template #trailing>
              <UIcon name="i-lucide-arrow-right" />
            </template>
          </UButton>

          <UButton
            variant="outline"
            size="xl"
            class="px-8 py-4"
            to="#demo"
          >
            <template #leading>
              <UIcon name="i-lucide-play" />
            </template>
            Watch Demo
          </UButton>
        </div>

        <div class="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div class="flex flex-col items-center">
            <div class="rounded-full bg-primary-100 dark:bg-primary-900 p-3 mb-4">
              <UIcon name="i-lucide-brain" class="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">AI-Powered Analysis</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 text-center mt-2">
              Smart job offer analysis to identify key requirements and skills
            </p>
          </div>

          <div class="flex flex-col items-center">
            <div class="rounded-full bg-primary-100 dark:bg-primary-900 p-3 mb-4">
              <UIcon name="i-lucide-file-text" class="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Dynamic CV Adaptation</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 text-center mt-2">
              Automatically tailor your CV to highlight relevant experience
            </p>
          </div>

          <div class="flex flex-col items-center">
            <div class="rounded-full bg-primary-100 dark:bg-primary-900 p-3 mb-4">
              <UIcon name="i-lucide-download" class="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Export Ready</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 text-center mt-2">
              Generate professional PDFs and cover letters instantly
            </p>
          </div>
        </div>
      </div>
    </UContainer>

    <!-- Background decoration -->
    <div class="absolute inset-0 -z-10 overflow-hidden">
      <div class="absolute left-1/2 top-0 ml-[-38rem] h-[25rem] w-[81.25rem] dark:[mask-image:linear-gradient(white,transparent)]">
        <div class="absolute inset-0 bg-gradient-to-r from-primary-300 to-purple-300 opacity-40 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-primary-400/30 dark:to-purple-400/30 dark:opacity-100" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Hero component for the landing page
// Introduces the CV optimization tool with AI-powered features
</script>