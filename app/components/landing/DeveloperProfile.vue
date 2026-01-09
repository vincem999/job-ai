<template>
  <section class="py-16 bg-gray-50 dark:bg-gray-800">
    <UContainer>
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Rencontrez le développeur
        </h2>
      </div>

      <div class="max-w-4xl mx-auto">
        <div
          class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 lg:p-12"
        >
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <!-- Profile Image -->
            <div class="flex justify-center">
              <div class="relative">
                <div style="width: 150px">
                  <img src="/photo_profil.png" alt="Vincent Monneger" >
                </div>

                <div
                  class="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center"
                >
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            <!-- Profile Info -->
            <div class="lg:col-span-2 text-center lg:text-left">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Vincent Monneger
              </h3>
              <p
                class="text-primary-600 dark:text-primary-400 font-semibold mb-4"
              >
                Développeur Full-Stack spécialisé Front-End & Passionné d'IA
              </p>
              <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Développeur expérimenté spécialisé dans les technologies web
                modernes et l'intégration de l'IA. Passionné par la création
                d'outils qui rationalisent les flux de travail et améliorent la
                productivité. Cet optimiseur de CV est né de l'expérience
                personnelle sur le marché du travail et du désir d'aider les
                autres à présenter leur meilleur profil professionnel.
              </p>

              <!-- Skills -->
              <div
                class="flex flex-wrap gap-2 mb-6 justify-center lg:justify-start"
              >
                <UBadge variant="subtle" color="primary">Vue.js</UBadge>
                <UBadge variant="subtle" color="primary">Nuxt</UBadge>
                <UBadge variant="subtle" color="primary">TypeScript</UBadge>
                <UBadge variant="subtle" color="primary">Node.js</UBadge>
                <UBadge variant="subtle" color="primary">AI Integration</UBadge>
              </div>

              <!-- Social Links -->
              <div class="flex gap-4 justify-center lg:justify-start">
                <UButton
                  variant="ghost"
                  size="sm"
                  to="https://linkedin.com/in/vincent-monneger"
                  target="_blank"
                  external
                >
                  <template #leading>
                    <UIcon name="i-lucide-linkedin" />
                  </template>
                  LinkedIn
                </UButton>

                <UButton
                  variant="ghost"
                  size="sm"
                  to="mailto:vincentmonneger@gmail.com"
                  external
                >
                  <template #leading>
                    <UIcon name="i-lucide-mail" />
                  </template>
                  Contact
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
// DeveloperProfile component introduces the developer behind the CV optimizer
// Provides professional credibility and personal connection with users
</script>
