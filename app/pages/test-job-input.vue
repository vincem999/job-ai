<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-2xl mx-auto px-4">
      <JobOfferInput
        @submit="handleSubmit"
        @clear="handleClear"
      />

      <!-- Display submitted data -->
      <div v-if="submittedData" class="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">Submitted Data:</h3>
        <pre class="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{{ JSON.stringify(submittedData, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const submittedData = ref(null)

const handleSubmit = (data: any) => {
  console.log('Job offer submitted:', data)
  submittedData.value = data
}

const handleClear = () => {
  console.log('Form cleared')
  submittedData.value = null
}

// Page meta
definePageMeta({
  title: 'Test Job Input Component'
})
</script>