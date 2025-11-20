<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          CV Vincent Monneger
        </h1>
        <UBadge variant="soft" color="primary" size="lg">
          Template avec données réelles
        </UBadge>
      </div>

      <CVTemplate :cv-data="cvData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import CVTemplate from '~/components/templates/CVTemplate.vue'
import { mockCVData } from '~/components/templates/mockCVData'

// Données du CV mises à jour avec les vraies informations
const cvData = ref(mockCVData)

// Meta pour la page
useHead({
  title: 'CV Vincent Monneger',
  meta: [
    { name: 'description', content: 'CV de Vincent Monneger - Développeur Front-end Vue.js' }
  ]
})
</script>