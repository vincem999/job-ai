<template>
  <UCard class="ats-suggestions-card">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-light-bulb" class="w-5 h-5 text-orange-600" />
        <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
          Suggestions d'optimisation
        </h4>
      </div>
    </template>

    <div v-if="suggestions?.length" class="space-y-4">
      <div
        v-for="(suggestion, index) in suggestions"
        :key="`suggestion-${index}`"
        class="suggestion-item"
      >
        <div class="suggestion-header">
          <div class="suggestion-icon">
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
          </div>
          <div class="suggestion-number">{{ index + 1 }}</div>
        </div>
        <div class="suggestion-content">
          <p class="suggestion-text">{{ suggestion }}</p>
        </div>
      </div>

      <!-- Résumé des actions -->
      <div class="summary-section">
        <div class="summary-header">
          <UIcon name="i-heroicons-clipboard-document-list" class="w-4 h-4 text-blue-600" />
          <span class="text-sm font-medium text-blue-600 dark:text-blue-400">
            {{ suggestions.length }} action{{ suggestions.length > 1 ? 's' : '' }} recommandée{{ suggestions.length > 1 ? 's' : '' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Aucune suggestion -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <UIcon name="i-heroicons-check-circle" class="w-12 h-12 text-green-500" />
      </div>
      <div class="empty-content">
        <h5 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Aucune suggestion
        </h5>
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          Votre CV semble déjà bien optimisé pour cette offre d'emploi !
        </p>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  suggestions?: string[]
}

defineProps<Props>()
</script>

<style scoped>
@reference "~/assets/css/main.css";

.ats-suggestions-card {
  @apply h-full;
}

.suggestion-item {
  @apply flex gap-3 p-4 bg-orange-50 dark:bg-orange-900/10;
  @apply border border-orange-200 dark:border-orange-800 rounded-lg;
  @apply transition-all hover:shadow-sm;
}

.suggestion-header {
  @apply flex-shrink-0 flex items-center gap-2;
}

.suggestion-icon {
  @apply text-orange-600 dark:text-orange-400;
}

.suggestion-number {
  @apply w-6 h-6 bg-orange-600 text-white text-xs font-bold;
  @apply rounded-full flex items-center justify-center;
}

.suggestion-content {
  @apply flex-1;
}

.suggestion-text {
  @apply text-gray-800 dark:text-gray-200 text-sm leading-relaxed;
}

.summary-section {
  @apply border-t border-gray-200 dark:border-gray-700 pt-4 mt-6;
}

.summary-header {
  @apply flex items-center gap-2;
}

.empty-state {
  @apply text-center py-8;
}

.empty-icon {
  @apply mb-4;
}

.empty-content {
  @apply max-w-xs mx-auto;
}
</style>