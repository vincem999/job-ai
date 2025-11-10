<template>
  <div class="container mx-auto p-8">
    <h1 class="text-2xl font-bold mb-4">Sentry Error Testing</h1>

    <div class="space-y-4">
      <UButton color="red" @click="throwClientError">
        Trigger Client Error
      </UButton>

      <UButton color="orange" @click="throwAsyncError">
        Trigger Async Error
      </UButton>

      <UButton color="gray" @click="throwServerError">
        Trigger Server Error
      </UButton>

      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Error:</strong> {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import * as Sentry from '@sentry/nuxt'

const error = ref('')

const throwClientError = () => {
  try {
    throw new Error('Test client-side error for Sentry monitoring')
  } catch (err) {
    error.value = err.message
    Sentry.captureException(err)
  }
}

async function throwAsyncError() {
  try {
    await new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Test async error for Sentry monitoring')), 100)
    })
  } catch (err) {
    error.value = err.message
    Sentry.captureException(err)
  }
}

async function throwServerError() {
  try {
    await $fetch('/api/test-error', {
      method: 'POST'
    })
  } catch (err) {
    error.value = err.message || 'Server error occurred'
    Sentry.captureException(err)
  }
}
</script>