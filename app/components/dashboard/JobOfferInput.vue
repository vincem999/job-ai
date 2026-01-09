<template>
  <div class="space-y-6">
    <UForm
      :state="state"
      :schema="schema"
      class="space-y-4"
      @submit="onSubmit"
      @error="onError"
    >
      <div class="flex gap-4 justify-between">
        <UFormField class="grow" name="title" label="Titre du poste" required>
          <UInput
            v-model="state.title"
            class="w-full"
            placeholder="ex. Développeur Frontend Senior"
            :disabled="loading"
          />
        </UFormField>

        <UFormField class="grow" name="company" label="Entreprise" required>
          <UInput
            v-model="state.company"
            class="w-full"
            placeholder="ex. Entreprise Tech SAS"
            :disabled="loading"
          />
        </UFormField>
      </div>

      <UFormField name="description" label="Description du poste" required>
        <UTextarea
          v-model="state.description"
          class="w-full"
          :rows="8"
          placeholder="Colle la description complète du poste ici..."
          :disabled="loading"
        />
      </UFormField>

      <div v-if="!isAnalyzing" class="flex justify-end space-x-3 pt-4">
        <UButton
          type="submit"
          size="md"
          :loading="loading"
          :disabled="!isFormValid"
        >
          Analyser l'offre
        </UButton>
      </div>
    </UForm>

    <!-- Real-time feedback -->
    <div v-if="feedback" class="mt-4">
      <UAlert
        :color="
          feedback.type === 'error'
            ? 'error'
            : feedback.type === 'warning'
            ? 'warning'
            : 'success'
        "
        :title="feedback.title"
        :description="feedback.message"
        :close-button="{ 'aria-label': 'Close' }"
        @close="feedback = null"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod"
import type { FormSubmitEvent, FormErrorEvent } from "@nuxt/ui"

// Define the schema for validation
const schema = z.object({
  title: z
    .string()
    .min(2, "Le titre du poste doit contenir au moins 2 caractères")
    .max(100, "Le titre du poste est trop long"),
  company: z
    .string()
    .min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères")
    .max(100, "Le nom de l'entreprise est trop long"),
  description: z
    .string()
    .min(50, "La description du poste doit contenir au moins 50 caractères")
    .max(5000, "La description du poste est trop longue"),
})

type Schema = z.infer<typeof schema>

// Reactive state
const state = reactive({
  title: "",
  company: "",
  description: "",
})

const loading = ref(false)
const isAnalyzing = ref(false)
const feedback = ref<{
  type: "success" | "error" | "warning"
  title: string
  message: string
} | null>(null)

// Computed property to check if form has minimum required data
const isFormValid = computed(() => {
  return (
    state.title.length >= 2 &&
    state.company.length >= 2 &&
    state.description.length >= 50
  )
})

// Define emits
const emit = defineEmits<{
  submit: [data: Schema]
  clear: []
}>()

// Define props
const props = defineProps<{
  analyzing?: boolean
}>()

// Watch for analyzing prop changes
watch(
  () => props.analyzing,
  (newValue) => {
    isAnalyzing.value = !!newValue
  },
  { immediate: true }
)

// Real-time validation feedback
watch(
  () => state.description,
  (newValue) => {
    if (newValue.length > 0 && newValue.length < 50) {
      showFeedback(
        "warning",
        "Description trop courte",
        `Ajoutez ${50 - newValue.length} caractères pour une meilleure analyse`
      )
    } else if (newValue.length >= 50 && newValue.length < 100) {
      showFeedback(
        "success",
        "Bon début !",
        "Continuez à ajouter des détails pour une analyse plus complète"
      )
    } else if (newValue.length >= 4500) {
      showFeedback(
        "warning",
        "Description très longue",
        "Considérez de la garder sous 5000 caractères"
      )
    } else if (feedback.value?.type === "warning" && newValue.length >= 100) {
      feedback.value = null
    }
  }
)

// Watch for input changes to provide real-time feedback
watch(
  () => [state.title, state.company] as const,
  ([title, company]) => {
    if (
      (title.length > 0 && title.length < 2) ||
      (company.length > 0 && company.length < 2)
    ) {
      showFeedback(
        "warning",
        "Saisie trop courte",
        "Le titre et le nom de l'entreprise doivent contenir au moins 2 caractères"
      )
    } else if (
      feedback.value?.type === "warning" &&
      title.length >= 2 &&
      company.length >= 2
    ) {
      feedback.value = null
    }
  }
)

const showFeedback = (
  type: "success" | "error" | "warning",
  title: string,
  message: string
) => {
  feedback.value = { type, title, message }
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true

  try {
    // Emit the validated data to parent component
    emit("submit", event.data)
  } catch (error) {
    console.error("Error submitting job offer:", error)
    showFeedback(
      "error",
      "Échec de la soumission",
      "Veuillez réessayer ou vérifier votre saisie"
    )
  } finally {
    loading.value = false
  }
}

const onError = (event: FormErrorEvent) => {
  console.log("Validation errors:", event.errors)
  const errorCount = event.errors.length
  showFeedback(
    "error",
    `${errorCount} erreur${errorCount > 1 ? "s" : ""} trouvée${
      errorCount > 1 ? "s" : ""
    }`,
    "Veuillez corriger les champs mis en évidence"
  )
}

// Auto-resize functionality could be added here in the future
</script>

<style scoped>
/* Custom styles if needed */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
