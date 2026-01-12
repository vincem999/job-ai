<template>
  <UCard>
    <div class="flex items-center gap-6">
      <div class="score-circle-container">
        <svg class="score-circle-svg" viewBox="0 0 100 100">
          <!-- Cercle de fond -->
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            stroke-width="6"
            class="circle-background"
          />
          <!-- Cercle de progression -->
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            stroke-width="6"
            :stroke-dasharray="circleProgress"
            :stroke-dashoffset="circleOffset"
            stroke-linecap="round"
            class="circle-progress"
            :class="getProgressColorClass()"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div class="score-content">
          <div class="score-number">{{ score }}</div>
          <div class="score-label">/100</div>
        </div>
      </div>

      <div class="flex flex-col gap-6">
        <div class="score-info">
          <h3 class="score-title">Score ATS</h3>
          <UBadge
            :color="getScoreColor()"
            size="lg"
            variant="soft"
            class="score-badge"
          >
            {{ getMessage() }}
          </UBadge>
        </div>
        <div v-if="adaptationNeeded" class="adaptation-notice">
          <UIcon name="i-lucide-triangle-alert" class="w-5 h-5" />
          <span class="text-sm"
            >Optimisation recommandée pour améliorer la compatibilité ATS</span
          >
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  score: number
  adaptationNeeded: boolean
}

const props = defineProps<Props>()

// Calcul de la circonférence du cercle (2πr, avec r=42)
const circumference = 2 * Math.PI * 42

// Calcul du stroke-dasharray et stroke-dashoffset pour le cercle de progression
const circleProgress = computed(() => {
  return `${circumference} ${circumference}`
})

const circleOffset = computed(() => {
  const progress = (props.score / 100) * circumference
  return circumference - progress
})

function getScoreColor(): "success" | "warning" | "error" {
  if (props.score >= 85) return "success"
  if (props.score >= 70) return "warning"
  return "error"
}

function getProgressColorClass(): string {
  if (props.score >= 85) return "circle-success"
  if (props.score >= 70) return "circle-warning"
  return "circle-error"
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

.score-circle-container {
  @apply relative w-30 h-30 flex items-center justify-center;
}

.score-circle-svg {
  @apply absolute inset-0;
}

.circle-background {
  @apply text-gray-200 dark:text-gray-700;
}

.circle-progress {
  transition: stroke-dashoffset 0.6s ease-in-out;
}

.circle-success {
  @apply text-green-500;
}

.circle-warning {
  @apply text-yellow-500;
}

.circle-error {
  @apply text-red-500;
}

.score-content {
  @apply relative z-10 flex flex-col items-center justify-center;
}

.score-number {
  @apply text-3xl font-extrabold light:text-gray-900 dark:text-white;
}

.score-label {
  @apply text-xs text-gray-500 dark:text-gray-400 font-bold;
}

.score-info {
  @apply flex-1;
}

.score-title {
  @apply text-xl font-bold mb-2;
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
