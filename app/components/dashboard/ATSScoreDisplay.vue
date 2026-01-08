<template>
  <div class="ats-score-display">
    <div class="score-section">
      <div class="score-circle">
        <div class="score-number">{{ score }}</div>
        <div class="score-label">/100</div>
      </div>
      <div class="score-info">
        <h3 class="score-title">Score ATS</h3>
        <UBadge :color="getScoreColor()" size="lg" class="score-badge">
          {{ getMessage() }}
        </UBadge>
      </div>
    </div>

    <div v-if="adaptationNeeded" class="adaptation-notice">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5" />
      <span class="text-sm"
        >Optimisation recommandée pour améliorer la compatibilité ATS</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  score: number
  adaptationNeeded: boolean
}

const props = defineProps<Props>()

function getScoreColor(): "success" | "warning" | "error" {
  if (props.score >= 85) return "success"
  if (props.score >= 70) return "warning"
  return "error"
}

function getMessage(): string {
  if (props.score >= 85) return "Excellent"
  if (props.score >= 70) return "Bon"
  if (props.score >= 50) return "À améliorer"
  return "Critique"
}
</script>

<style scoped>
@reference "~/assets/css/main.css";

.ats-score-display {
  @apply bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20;
  @apply border border-blue-200 dark:border-blue-800 rounded-lg p-6;
}

.score-section {
  @apply flex items-center gap-6 mb-4;
}

.score-circle {
  @apply relative w-20 h-20 rounded-full border-4 border-blue-600 dark:border-blue-400;
  @apply flex flex-col items-center justify-center bg-white dark:bg-gray-800;
  @apply shadow-lg;
}

.score-number {
  @apply text-2xl font-bold text-blue-600 dark:text-blue-400;
}

.score-label {
  @apply text-xs text-gray-500 dark:text-gray-400 font-medium;
}

.score-info {
  @apply flex-1;
}

.score-title {
  @apply text-xl font-semibold text-gray-900 dark:text-white mb-2;
}

.score-badge {
  @apply text-sm;
}

.adaptation-notice {
  @apply flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20;
  @apply border border-orange-200 dark:border-orange-800 rounded-md;
  @apply text-orange-700 dark:text-orange-300;
}
</style>
