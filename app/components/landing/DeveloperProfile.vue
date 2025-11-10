<template>
  <section class="py-16 bg-gray-50 dark:bg-gray-800">
    <UContainer>
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Meet the Developer
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Passionate about creating tools that help developers and job seekers
          succeed in their careers.
        </p>
      </div>

      <div class="max-w-4xl mx-auto">
        <div
          class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 lg:p-12"
        >
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <!-- Profile Image -->
            <div class="flex justify-center lg:justify-start">
              <div class="relative">
                <div
                  class="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 p-1"
                >
                  <div
                    class="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center"
                  >
                    <UIcon
                      name="i-lucide-user"
                      class="w-16 h-16 text-gray-400 dark:text-gray-500"
                    />
                  </div>
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
                Full-Stack Developer & AI Enthusiast
              </p>
              <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Experienced developer specializing in modern web technologies
                and AI integration. Passionate about creating tools that
                streamline workflows and enhance productivity. This CV optimizer
                was born from personal experience in the job market and the
                desire to help others present their best professional selves.
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
                <UBadge variant="subtle" color="primary">Python</UBadge>
              </div>

              <!-- Social Links -->
              <div class="flex gap-4 justify-center lg:justify-start">
                <UButton
                  variant="ghost"
                  size="sm"
                  to="https://github.com/vmonneger"
                  target="_blank"
                  external
                >
                  <template #leading>
                    <UIcon name="i-lucide-github" />
                  </template>
                  GitHub
                </UButton>

                <UButton
                  variant="ghost"
                  size="sm"
                  to="https://linkedin.com/in/valentin-monneger"
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
                  to="mailto:contact@vmonneger.dev"
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

          <!-- Stats -->
          <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div
                  class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2"
                >
                  5+
                </div>
                <div class="text-gray-600 dark:text-gray-300">
                  Years Experience
                </div>
              </div>
              <div>
                <div
                  class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2"
                >
                  50+
                </div>
                <div class="text-gray-600 dark:text-gray-300">
                  Projects Completed
                </div>
              </div>
              <div>
                <div
                  class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2"
                >
                  100%
                </div>
                <div class="text-gray-600 dark:text-gray-300">Open Source</div>
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
