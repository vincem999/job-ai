<template>
  <UCard class="ats-keywords-card">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-search" class="size-6 text-primary" />
        <h4 class="text-lg font-bold">Analyse des mots-clés ATS</h4>
      </div>
    </template>

    <div class="space-y-10">
      <!-- Mots-clés critiques manquants -->
      <div v-if="keywords.missing?.length">
        <div class="flex items-center gap-2 mb-3">
          <UIcon name="i-lucide-circle-alert" class="size-5 text-error" />
          <h5 class="font-semibold text-error">
            Critiques manquants ({{ keywords.missing.length }})
          </h5>
        </div>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="keyword in keywords.missing"
            :key="`missing-${keyword}`"
          >
            <UIcon name="i-lucide-triangle-alert" class="text-warning size-3" />
            {{ keyword }}
          </UBadge>
        </div>
        <p class="text-xs mt-3">
          Ces mots-clés sont essentiels pour passer les filtres ATS
        </p>
      </div>

      <!-- Mots-clés trouvés -->
      <div v-if="keywords.matched?.length">
        <div class="flex items-center gap-2 mb-3">
          <UIcon name="i-lucide-circle-check" class="size-5 text-success" />
          <h5 class="font-semibold text-success">
            Correspondants ({{ keywords.matched.length }})
          </h5>
        </div>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="keyword in keywords.matched"
            :key="`matched-${keyword}`"
          >
            <UIcon name="i-lucide-check" class="text-success size-3" />
            {{ keyword }}
          </UBadge>
        </div>
      </div>

      <!-- Recommandations -->
      <div v-if="keywords.recommended?.length">
        <div class="flex items-center gap-2 mb-3">
          <UIcon name="i-lucide-lightbulb" class="size-5 text-info" />
          <h5 class="font-semibold text-info">
            Recommandations ({{ keywords.recommended.length }})
          </h5>
        </div>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="keyword in keywords.recommended"
            :key="`recommended-${keyword}`"
          >
            <UIcon name="i-lucide-lightbulb" class="text-info size-3" />
            {{ keyword }}
          </UBadge>
        </div>
        <p class="text-xs mt-3">
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
  }
}

const props = defineProps<Props>()

const hasKeywords = computed(() => {
  if (!props.keywords) return false
  return (
    props.keywords.matched?.length > 0 ||
    props.keywords.missing?.length > 0 ||
    props.keywords.recommended?.length > 0
  )
})
</script>

<style scoped>
@reference "~/assets/css/main.css";

.ats-keywords-card {
  @apply h-full;
}
</style>
