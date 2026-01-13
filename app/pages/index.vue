<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark">
    <!-- Header Section -->
    <header
      :class="`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'py-0 glass border-b'
          : 'py-2 bg-transparent border-b border-transparent'
      }`"
    >
      <UContainer>
        <div class="flex justify-between items-center h-16">
          <!-- Logo and Title -->
          <div>
            <AppLogo class="" />
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
            <ColorModeButton />
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
    <footer class="text-white py-12">
      <UContainer>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Brand Section -->
          <div>
            <p class="text-gray-300 mb-4">
              Transformez vos candidatures avec la génération de CV et lettres
              de motivation par IA.
            </p>
            <p class="text-sm text-gray-400">
              Fait avec ❤️ en utilisant Nuxt 4 et OpenAI
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="font-semibold mb-4">Liens rapides</h3>
            <ul class="space-y-2 text-gray-600 dark:text-gray-300">
              <li>
                <NuxtLink
                  to="/dashboard"
                  class="hover:text-primary-400 transition-colors"
                >
                  Commencer
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Contact & Social -->
          <div>
            <h3 class="font-semibold mb-4">Contact</h3>
            <ul class="space-y-2 text-gray-600 dark:text-gray-300">
              <li>
                <a
                  href="https://linkedin.com/in/vincent-monneger"
                  class="hover:text-primary-400 transition-colors"
                  target="_blank"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="mailto:vincentmonneger@gmail.com"
                  class="hover:text-primary-400 transition-colors"
                >
                  Mail
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          class="border-t border-white dark:border-white/5 mt-8 pt-8 text-center text-gray-400"
        >
          <p>&copy; 2025 Optimiseur CV.</p>
        </div>
      </UContainer>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Métadonnées de la page
useHead({
  title: "CV Optimizer - Générateur de CV et lettres personnalisés",
  meta: [
    {
      name: "description",
      content:
        "Générez automatiquement des CV et lettres de motivation adaptés à chaque offre d'emploi avec l'intelligence artificielle.",
    },
  ],
})

const scrolled = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll)
})

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll)
})
</script>

<style lang="css" scoped>
.glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
