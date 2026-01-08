<template>
  <UCard class="ats-keywords-card">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-key" class="w-5 h-5 text-blue-600" />
        <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
          Analyse des mots-clés ATS
        </h4>
      </div>
    </template>

    <div class="space-y-6">
      <!-- Mots-clés critiques manquants -->
      <div v-if="keywords.priority?.length || keywords.missing?.length">
        <div class="flex items-center gap-2 mb-3">
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="w-4 h-4 text-red-600"
          />
          <h5 class="font-medium text-red-600 dark:text-red-400">
            Critiques manquants ({{
              (keywords.priority?.length || 0) +
              (keywords.missing?.length || 0)
            }})
          </h5>
        </div>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="keyword in keywords.priority"
            :key="`priority-${keyword}`"
            color="red"
            variant="solid"
            size="lg"
          >
            {{ keyword }} ⚠️
          </UBadge>
          <UBadge
            v-for="keyword in keywords.missing"
            :key="`missing-${keyword}`"
            color="red"
            variant="outline"
            size="lg"
          >
            {{ keyword }}
          </UBadge>
        </div>
        <p class="text-sm text-red-600 dark:text-red-400 mt-2">
          Ces mots-clés sont essentiels pour passer les filtres ATS
        </p>
      </div>

      <!-- Mots-clés trouvés -->
      <div v-if="keywords.matched?.length">
        <div class="flex items-center gap-2 mb-3">
          <UIcon
            name="i-heroicons-check-circle"
            class="w-4 h-4 text-green-600"
          />
          <h5 class="font-medium text-green-600 dark:text-green-400">
            Correspondants ({{ keywords.matched.length }})
          </h5>
        </div>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="keyword in keywords.matched"
            :key="`matched-${keyword}`"
            color="green"
            variant="soft"
            size="lg"
          >
            {{ keyword }} ✓
          </UBadge>
        </div>
      </div>

      <!-- Recommandations -->
      <div v-if="keywords.recommended?.length">
        <div class="flex items-center gap-2 mb-3">
          <UIcon name="i-heroicons-light-bulb" class="w-4 h-4 text-blue-600" />
          <h5 class="font-medium text-blue-600 dark:text-blue-400">
            Recommandations ({{ keywords.recommended.length }})
          </h5>
        </div>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="keyword in keywords.recommended"
            :key="`recommended-${keyword}`"
            color="blue"
            variant="outline"
            size="lg"
          >
            {{ keyword }} 💡
          </UBadge>
        </div>
        <p class="text-sm text-blue-600 dark:text-blue-400 mt-2">
          Ajoutez ces mots-clés pour renforcer votre profil
        </p>
      </div>

      <!-- Aucune donnée -->
      <div v-if="!hasKeywords" class="text-center py-6">
        <UIcon
          name="i-heroicons-document-text"
          class="w-12 h-12 text-gray-400 mx-auto mb-2"
        />
        <p class="text-gray-500 dark:text-gray-400">
          Aucune analyse de mots-clés disponible
        </p>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  keywords?: {
    matched: string[]
    missing: string[]
    recommended: string[]
    priority: string[]
  }
}

const props = defineProps<Props>()

const hasKeywords = computed(() => {
  if (!props.keywords) return false
  return (
    props.keywords.matched?.length > 0 ||
    props.keywords.missing?.length > 0 ||
    props.keywords.recommended?.length > 0 ||
    props.keywords.priority?.length > 0
  )
})
</script>

<style scoped>
@reference "~/assets/css/main.css";

.ats-keywords-card {
  @apply h-full;
}
</style>
