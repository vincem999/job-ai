<template>
  <section
    class="relative pt-34 pb-24 px-6 text-center max-w-5xl mx-auto overflow-visible"
  >
    <div class="hero-glow"></div>
    <div class="relative z-10 flex flex-col items-center">
      <UBadge color="primary" variant="subtle" size="lg" class="mb-8">
        🚀 Optimisez vos candidatures avec l'IA
      </UBadge>

      <h1
        class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl"
      >
        Transformez votre CV pour chaque
        <span class="text-primary-600 dark:text-primary-400">
          opportunité d'emploi</span
        >
      </h1>

      <p
        class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300"
      >
        Utilisez l'IA pour analyser les offres d'emploi et adapter
        automatiquement votre CV pour correspondre parfaitement aux exigences.
        Générez des lettres de motivation convaincantes et exportez des
        documents professionnels instantanément.
      </p>

      <div class="mt-10 flex flex-row gap-4 justify-center">
        <UButton size="xl" class="px-8 py-4" to="/dashboard">
          Commencer
          <template #trailing>
            <UIcon name="i-lucide-arrow-right" />
          </template>
        </UButton>
      </div>
    </div>
  </section>

  <section class="px-6 py-12 pb-25 max-w-7xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <UCard class="flex flex-col items-center">
        <div class="mb-4">
          <UIcon
            name="i-lucide-brain"
            class="h-8 w-8 text-primary-600 dark:text-primary-400"
          />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Analyse par IA
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-300 mt-2">
          Analyse intelligente des offres d'emploi pour identifier les exigences
          clés et compétences
        </p>
      </UCard>

      <UCard class="flex flex-col items-center">
        <div class="mb-4">
          <UIcon
            name="i-lucide-file-text"
            class="h-8 w-8 text-primary-600 dark:text-primary-400"
          />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Adaptation dynamique du CV
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-300 mt-2">
          Adaptez automatiquement votre CV pour mettre en valeur l'expérience
          pertinente
        </p>
      </UCard>

      <UCard class="flex flex-col items-center">
        <div class="mb-4">
          <UIcon
            name="i-lucide-download"
            class="h-8 w-8 text-primary-600 dark:text-primary-400"
          />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Prêt à exporter
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-300 mt-2">
          Générez des PDF professionnels et lettres de motivation instantanément
        </p>
      </UCard>
    </div>
  </section>

  <!-- Background decoration -->
  <!-- <div class="absolute inset-0 -z-10 overflow-hidden">
    <div
      class="absolute left-1/2 top-0 ml-[-38rem] h-[25rem] w-[81.25rem] dark:[mask-image:linear-gradient(white,transparent)]"
    >
      <div
        class="absolute inset-0 bg-gradient-to-r from-primary-300 to-purple-300 opacity-40 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-primary-400/30 dark:to-purple-400/30 dark:opacity-100"
      />
    </div>
  </div> -->
</template>

<script setup lang="ts">
// Hero component for the landing page
// Introduces the CV optimization tool with AI-powered features
</script>

<style lang="css" scoped>
.hero-glow {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 700px;
  background: radial-gradient(
    circle at center,
    rgba(16, 185, 129, 0.1) 20%,
    transparent 60%
  );
  pointer-events: none;
  z-index: 0;
}
</style>
