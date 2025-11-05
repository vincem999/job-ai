<template>
  <div class="test-page">
    <div class="container mx-auto p-8">
      <h1 class="text-3xl font-bold mb-8 text-center">Test Letter Template</h1>

      <div class="mb-8 text-center">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="toggleTemplate"
        >
          {{ showTemplate ? 'Hide Template' : 'Show Template' }}
        </button>
      </div>

      <div v-if="showTemplate" class="letter-preview">
        <LetterTemplate :letter-data="letterData" />
      </div>

      <div v-if="!showTemplate" class="data-preview">
        <h2 class="text-xl font-semibold mb-4">Letter Data Structure:</h2>
        <pre class="bg-gray-100 p-4 rounded text-sm overflow-auto">{{ JSON.stringify(letterData, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LetterTemplate from '~/components/templates/LetterTemplate.vue'
import { mockLetterData } from '~/components/templates/mockLetterData'

const showTemplate = ref(true)
const letterData = ref(mockLetterData)

const toggleTemplate = () => {
  showTemplate.value = !showTemplate.value
}

// Set page meta
useHead({
  title: 'Test Letter Template - Job Finder'
})
</script>

<style scoped>
.test-page {
  min-height: 100vh;
  background-color: #f9fafb;
}

.letter-preview {
  max-width: 210mm; /* A4 width */
  margin: 0 auto;
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.data-preview {
  max-width: 800px;
  margin: 0 auto;
}
</style>