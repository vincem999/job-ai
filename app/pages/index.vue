<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header Section -->
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <UContainer>
        <div class="flex justify-between items-center h-16">
          <!-- Logo and Title -->
          <div class="flex items-center space-x-4">
            <UIcon name="i-heroicons-briefcase" class="w-8 h-8 text-primary-600" />
            <div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">
                Optimiseur CV
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Générateur de CV et lettres IA
              </p>
            </div>
          </div>

          <!-- Navigation Actions -->
          <div class="flex items-center space-x-4">
            <UButton
              to="/dashboard"
              variant="solid"
              color="primary"
              icon="i-heroicons-rocket-launch"
            >
              Commencer
            </UButton>

            <!-- Color Mode Toggle -->
            <UButton
              variant="ghost"
              color="neutral"
              icon="i-heroicons-sun"
              :aria-label="$colorMode.preference === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'"
              @click="$colorMode.preference = $colorMode.preference === 'dark' ? 'light' : 'dark'"
            />
          </div>
        </div>
      </UContainer>
    </header>

    <!-- Main Content -->
    <main>
      <!-- Hero Section -->
      <LandingHero />

      <!-- Tech Stack Section -->
      <LandingTechStack />

      <!-- Demo Preview Section -->
      <LandingDemoPreview />

      <!-- Developer Profile Section -->
      <LandingDeveloperProfile />
    </main>

    <!-- Footer Section -->
    <footer class="bg-gray-900 dark:bg-gray-950 text-white py-12">
      <UContainer>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Brand Section -->
          <div>
            <div class="flex items-center space-x-2 mb-4">
              <UIcon name="i-heroicons-briefcase" class="w-6 h-6 text-primary-400" />
              <span class="text-xl font-bold">Optimiseur CV</span>
            </div>
            <p class="text-gray-300 mb-4">
              Transformez vos candidatures avec la génération de CV et lettres de motivation par IA.
            </p>
            <p class="text-sm text-gray-400">
              Fait avec ❤️ en utilisant Nuxt 4 et OpenAI
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="font-semibold mb-4">Liens rapides</h3>
            <ul class="space-y-2 text-gray-300">
              <li>
                <NuxtLink to="/dashboard" class="hover:text-primary-400 transition-colors">
                  Commencer
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="#demo" class="hover:text-primary-400 transition-colors">
                  Démo
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="#tech-stack" class="hover:text-primary-400 transition-colors">
                  Technologies
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Contact & Social -->
          <div>
            <h3 class="font-semibold mb-4">Contact</h3>
            <ul class="space-y-2 text-gray-300">
              <li>
                <a href="#" class="hover:text-primary-400 transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-primary-400 transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-primary-400 transition-colors">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Optimiseur CV. Créé pour présenter les pratiques modernes de développement web.</p>
        </div>
      </UContainer>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Métadonnées de la page
useHead({
  title: 'CV Optimizer - Générateur de CV et lettres personnalisés',
  meta: [
    {
      name: 'description',
      content: 'Générez automatiquement des CV et lettres de motivation adaptés à chaque offre d\'emploi avec l\'intelligence artificielle.'
    }
  ]
})
</script>

