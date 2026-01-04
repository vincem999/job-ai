<template>
  <div class="experience-editor">
    <h3 class="editor-title">Modifier les expériences</h3>

    <div
      v-for="(experience, index) in props.cvData.workExperiences"
      :key="experience.id || index"
      class="experience-form"
    >
      <!-- En-tête de l'expérience (non éditable) -->
      <div class="experience-header">
        <h4>{{ experience.title }}</h4>
        <p class="company-info">
          {{ experience.company }} • {{ experience.startDate }} -
          {{ experience.endDate }}
        </p>
      </div>

      <!-- Description -->
      <UFormField label="Description du poste">
        <UTextarea
          :model-value="experience.description"
          placeholder="Décrivez les principales missions..."
          class="w-full"
          :rows="3"
          @update:model-value="updateDescription(index, $event)"
        />
      </UFormField>

      <!-- Bullets/Responsabilités -->
      <UFormField label="Responsabilités principales">
        <div class="bullets-editor">
          <div
            v-for="(bullet, bulletIndex) in experience.bullets || []"
            :key="bulletIndex"
            class="bullet-row"
          >
            <UInput
              :model-value="bullet"
              placeholder="Responsabilité ou réalisation..."
              class="w-full"
              @update:model-value="updateBullet(index, bulletIndex, $event)"
            />
            <UButton
              icon="i-heroicons-trash"
              variant="ghost"
              size="sm"
              color="error"
              @click="removeBullet(index, bulletIndex)"
            />
          </div>

          <UButton
            icon="i-heroicons-plus"
            variant="outline"
            size="sm"
            class="add-bullet-btn"
            @click="addBullet(index)"
          >
            Ajouter une responsabilité
          </UButton>
        </div>
      </UFormField>

      <UDivider
        v-if="index < props.cvData.workExperiences.length - 1"
        class="my-6"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CV } from "../../../types/cv"

interface Props {
  cvData: CV
}

const props = defineProps<Props>()

const emit = defineEmits<{
  "update:cvData": [cv: CV]
}>()

// Direct mutations avec emit
const updateDescription = (index: number, value: string) => {
  const updated = { ...props.cvData }
  if (updated.workExperiences?.[index]) {
    updated.workExperiences[index].description = value
    emit("update:cvData", updated)
  }
}

const updateBullet = (expIndex: number, bulletIndex: number, value: string) => {
  const updated = { ...props.cvData }
  if (
    updated.workExperiences?.[expIndex]?.bullets?.[bulletIndex] !== undefined
  ) {
    updated.workExperiences[expIndex].bullets[bulletIndex] = value
    emit("update:cvData", updated)
  }
}

const addBullet = (expIndex: number) => {
  const updated = { ...props.cvData }
  if (updated.workExperiences?.[expIndex]) {
    if (!updated.workExperiences[expIndex].bullets) {
      updated.workExperiences[expIndex].bullets = []
    }
    updated.workExperiences[expIndex].bullets.push("")
    emit("update:cvData", updated)
  }
}

const removeBullet = (expIndex: number, bulletIndex: number) => {
  const updated = { ...props.cvData }
  if (updated.workExperiences?.[expIndex]?.bullets) {
    updated.workExperiences[expIndex].bullets.splice(bulletIndex, 1)
    emit("update:cvData", updated)
  }
}
</script>

<style scoped>
@reference "~/assets/css/main.css";

.experience-editor {
  @apply space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700;
}

.editor-title {
  @apply text-xl font-semibold text-gray-900 dark:text-white mb-4;
}

.experience-form {
  @apply space-y-4;
}

.experience-header h4 {
  @apply text-lg font-medium text-gray-900 dark:text-white;
}

.company-info {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

.bullets-editor {
  @apply space-y-3;
}

.bullet-row {
  @apply flex items-center gap-2;
}

/* .bullet-row :deep(input) {
  @apply w-full;
} */

.add-bullet-btn {
  @apply w-full justify-center;
}
</style>
