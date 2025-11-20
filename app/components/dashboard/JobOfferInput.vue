<template>
  <div class="space-y-6">
    <UForm
      :state="state"
      :schema="schema"
      class="space-y-4"
      @submit="onSubmit"
      @error="onError"
    >
      <UFormField name="title" label="Job Title" required>
        <UInput
          v-model="state.title"
          class="w-full"
          placeholder="e.g. Senior Frontend Developer"
          :disabled="loading"
        />
      </UFormField>

      <UFormField name="company" label="Company" required>
        <UInput
          v-model="state.company"
          class="w-full"
          placeholder="e.g. Tech Corp Inc."
          :disabled="loading"
        />
      </UFormField>

      <UFormField name="description" label="Job Description" required>
        <UTextarea
          v-model="state.description"
          class="w-full"
          :rows="8"
          placeholder="Paste the complete job description here..."
          :disabled="loading"
        />
      </UFormField>

      <div class="flex justify-end space-x-3 pt-4">
        <UButton
          type="button"
          color="neutral"
          variant="ghost"
          :disabled="loading"
          @click="clearForm"
        >
          Clear
        </UButton>
        <UButton type="submit" :loading="loading" :disabled="!isFormValid">
          Analyze Job Offer
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
    .min(2, "Job title must be at least 2 characters")
    .max(100, "Job title is too long"),
  company: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name is too long"),
  description: z
    .string()
    .min(50, "Job description must be at least 50 characters")
    .max(5000, "Job description is too long"),
})

type Schema = z.infer<typeof schema>

// Reactive state
const state = reactive({
  title: "",
  company: "",
  description: "",
})

const loading = ref(false)
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

// Real-time validation feedback
watch(
  () => state.description,
  (newValue) => {
    if (newValue.length > 0 && newValue.length < 50) {
      showFeedback(
        "warning",
        "Description too short",
        `Add ${50 - newValue.length} more characters for a better analysis`
      )
    } else if (newValue.length >= 50 && newValue.length < 100) {
      showFeedback(
        "success",
        "Good start!",
        "Keep adding details for a more comprehensive analysis"
      )
    } else if (newValue.length >= 4500) {
      showFeedback(
        "warning",
        "Description very long",
        "Consider keeping it under 5000 characters"
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
        "Input too short",
        "Title and company name should be at least 2 characters"
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

    showFeedback(
      "success",
      "Job offer submitted!",
      "Analyzing the job requirements..."
    )
  } catch (error) {
    console.error("Error submitting job offer:", error)
    showFeedback(
      "error",
      "Submission failed",
      "Please try again or check your input"
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
    `${errorCount} error${errorCount > 1 ? "s" : ""} found`,
    "Please correct the highlighted fields"
  )
}

const clearForm = () => {
  state.title = ""
  state.company = ""
  state.description = ""
  feedback.value = null
  emit("clear")
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
