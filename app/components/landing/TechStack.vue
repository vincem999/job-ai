<template>
  <section class="py-25 border-y border-white dark:border-white/5">
    <UContainer>
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Construit avec des technologies modernes
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          En tirant parti des technologies de pointe pour offrir une solution
          rapide, fiable et évolutive pour vos besoins d'optimisation de CV.
        </p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        <!-- Frontend Technologies -->
        <UCard>
          <div class="flex flex-col items-center">
            <div
              class="w-16 h-16 mb-4 p-3 bg-green-100 dark:bg-green-900 rounded-xl group-hover:scale-110 transition-transform duration-200"
            >
              <UIcon
                name="i-lucide-zap"
                class="w-10 h-10 text-green-600 dark:text-green-400"
              />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
              Nuxt 4
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 text-center">
              Framework full-stack avec SSR
            </p>
          </div>
        </UCard>

        <UCard>
          <div class="flex flex-col items-center">
            <div
              class="w-16 h-16 mb-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-xl group-hover:scale-110 transition-transform duration-200"
            >
              <UIcon
                name="i-lucide-code-xml"
                class="w-10 h-10 text-blue-600 dark:text-blue-400"
              />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
              TypeScript
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 text-center">
              Développement type-safe
            </p>
          </div>
        </UCard>

        <UCard>
          <div class="flex flex-col items-center">
            <div
              class="w-16 h-16 mb-4 p-3 bg-cyan-100 dark:bg-cyan-900 rounded-xl group-hover:scale-110 transition-transform duration-200"
            >
              <UIcon
                name="i-lucide-palette"
                class="w-10 h-10 text-cyan-600 dark:text-cyan-400"
              />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
              Tailwind CSS
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 text-center">
              Styling utility-first
            </p>
          </div>
        </UCard>

        <UCard>
          <div class="flex flex-col items-center">
            <div
              class="w-16 h-16 mb-4 p-3 bg-purple-100 dark:bg-purple-900 rounded-xl group-hover:scale-110 transition-transform duration-200"
            >
              <UIcon
                name="i-lucide-component"
                class="w-10 h-10 text-purple-600 dark:text-purple-400"
              />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
              Nuxt UI
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 text-center">
              Composants UI magnifiques
            </p>
          </div>
        </UCard>

        <!-- Backend & AI Technologies -->
        <UCard>
          <div class="flex flex-col items-center">
            <div
              class="w-16 h-16 mb-4 p-3 bg-orange-100 dark:bg-orange-900 rounded-xl group-hover:scale-110 transition-transform duration-200"
            >
              <UIcon
                name="i-lucide-brain"
                class="w-10 h-10 text-orange-600 dark:text-orange-400"
              />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
              OpenAI
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 text-center">
              Analyse par IA
            </p>
          </div>
        </UCard>
      </div>

      <!-- Key Benefits -->
      <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center">
          <div
            class="w-12 h-12 mx-auto mb-4 p-2 bg-primary-100 dark:bg-primary-900 rounded-lg"
          >
            <UIcon
              name="i-lucide-zap"
              class="w-8 h-8 text-primary-600 dark:text-primary-400"
            />
          </div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
            Performance avant tout
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Construit avec Nuxt 4 et Vite pour un chargement ultra-rapide et une
            expérience utilisateur optimale.
          </p>
        </div>

        <div class="text-center">
          <div
            class="w-12 h-12 mx-auto mb-4 p-2 bg-primary-100 dark:bg-primary-900 rounded-lg"
          >
            <UIcon
              name="i-lucide-shield"
              class="w-8 h-8 text-primary-600 dark:text-primary-400"
            />
          </div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
            Type-safe
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            TypeScript et Zod assurent un code robuste et sans erreur avec une
            validation complète.
          </p>
        </div>

        <div class="text-center">
          <div
            class="w-12 h-12 mx-auto mb-4 p-2 bg-primary-100 dark:bg-primary-900 rounded-lg"
          >
            <UIcon
              name="i-lucide-brain"
              class="w-8 h-8 text-primary-600 dark:text-primary-400"
            />
          </div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
            Propulsé par l'IA
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Tire parti des modèles avancés d'OpenAI pour l'analyse intelligente
            d'offres d'emploi et l'optimisation de CV.
          </p>
        </div>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
// TechStack component showcases the technologies used in the application
// Provides visual representation of the modern tech stack with descriptions
</script>
