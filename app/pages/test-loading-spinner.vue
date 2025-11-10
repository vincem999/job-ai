<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto max-w-4xl px-4">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">LoadingSpinner Component Test</h1>
        <p class="text-gray-600">Testing different configurations of the LoadingSpinner component</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Default Spinner -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Default Spinner</h3>
          </template>
          <LoadingSpinner />
        </UCard>

        <!-- Different Sizes -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Different Sizes</h3>
          </template>
          <div class="space-y-4">
            <div>
              <p class="text-sm text-gray-600 mb-2">Small:</p>
              <LoadingSpinner size="sm" />
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-2">Medium:</p>
              <LoadingSpinner size="md" />
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-2">Large:</p>
              <LoadingSpinner size="lg" />
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-2">Extra Large:</p>
              <LoadingSpinner size="xl" />
            </div>
          </div>
        </UCard>

        <!-- Without Text -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Without Text</h3>
          </template>
          <LoadingSpinner :show-text="false" />
        </UCard>

        <!-- Custom Text -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Custom Text</h3>
          </template>
          <div class="space-y-4">
            <LoadingSpinner text="Generating documents..." />
            <LoadingSpinner text="Analyzing job offer..." />
            <LoadingSpinner text="Adapting CV..." />
          </div>
        </UCard>

        <!-- Custom Colors -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Custom Colors</h3>
          </template>
          <div class="space-y-4">
            <LoadingSpinner color="text-blue-500" text="Blue spinner" />
            <LoadingSpinner color="text-green-500" text="Green spinner" />
            <LoadingSpinner color="text-red-500" text="Red spinner" />
            <LoadingSpinner color="text-purple-500" text="Purple spinner" />
          </div>
        </UCard>

        <!-- Different Icons -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Different Icons</h3>
          </template>
          <div class="space-y-4">
            <LoadingSpinner icon="i-lucide-loader" text="Default loader" />
            <LoadingSpinner icon="i-lucide-refresh-cw" text="Refresh icon" />
            <LoadingSpinner icon="i-lucide-circle-dashed" text="Circle dashed" />
          </div>
        </UCard>

        <!-- Minimal Container -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Minimal Container</h3>
          </template>
          <LoadingSpinner
            container-class="p-2"
            text="Minimal padding"
            size="sm"
          />
        </UCard>

        <!-- In Context Example -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">In Context Example</h3>
          </template>
          <div class="space-y-4">
            <UButton
              :disabled="isDemo"
              color="primary"
              @click="toggleDemo"
            >
              {{ isDemo ? 'Loading...' : 'Start Demo' }}
            </UButton>

            <div v-if="isDemo" class="border-2 border-dashed border-gray-200 rounded-lg">
              <LoadingSpinner
                text="Processing your request..."
                container-class="py-8"
              />
            </div>
          </div>
        </UCard>
      </div>

      <div class="mt-8 flex justify-center">
        <NuxtLink to="/" class="text-blue-600 hover:text-blue-800 underline">
          ← Back to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoadingSpinner from '~/components/dashboard/LoadingSpinner.vue'

const isDemo = ref(false)

const toggleDemo = () => {
  isDemo.value = true
  setTimeout(() => {
    isDemo.value = false
  }, 3000)
}
</script>