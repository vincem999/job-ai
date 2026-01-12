<template>
  <UCard class="ats-suggestions-card">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-lightbulb" class="size-6 text-primary" />
        <h4 class="text-lg font-bold">Suggestions d'optimisation</h4>
      </div>
    </template>

    <div v-if="suggestions?.length" class="space-y-4">
      <div
        v-for="(suggestion, index) in suggestions"
        :key="`suggestion-${index}`"
        class="suggestion-item"
      >
        <div class="suggestion-header">
          <div class="suggestion-number">{{ index + 1 }}</div>
        </div>
        <div class="suggestion-content">
          <p class="text-sm">{{ suggestion }}</p>
        </div>
      </div>

      <!-- Résumé des actions -->

      <div class="summary-header mt-6">
        <UIcon name="i-lucide-circle-check-big" class="size-4 text-primary" />
        <span class="text-sm font-medium text-primary">
          {{ suggestions.length }} action{{
            suggestions.length > 1 ? "s" : ""
          }}
          recommandée{{ suggestions.length > 1 ? "s" : "" }}
        </span>
      </div>
    </div>

    <!-- Aucune suggestion -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <UIcon
          name="i-heroicons-check-circle"
          class="w-12 h-12 text-green-500"
        />
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
  @apply flex gap-3 p-4 light:bg-slate-100 dark:bg-background-dark/40;
  @apply border border-slate-200 dark:border-border-dark  rounded-lg;
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
