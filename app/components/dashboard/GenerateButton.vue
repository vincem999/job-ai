<template>
  <div class="space-y-3">
    <UButton
      :loading="loading"
      :disabled="isButtonDisabled"
      color="primary"
      variant="solid"
      size="lg"
      class="w-full"
      loading-icon="i-lucide-loader"
      @click="handleGenerate"
    >
      <template v-if="!loading">
        <Icon name="i-lucide-file-text" class="mr-2" />
        Generate Documents
      </template>
      <template v-else>
        Generating your documents...
      </template>
    </UButton>

    <!-- Validation feedback -->
    <div v-if="showValidationMessage" class="text-sm text-center">
      <UAlert
        v-if="!hasValidInput"
        color="warning"
        variant="soft"
        title="Input Required"
        description="Please fill in the job title, company, and description (at least 50 characters) before generating documents."
        :close-button="false"
        class="text-left"
      />
      <UAlert
        v-else-if="loading"
        color="info"
        variant="soft"
        title="Generating..."
        description="This may take a few moments. Please don't close this page."
        :close-button="false"
        class="text-left"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  disabled?: boolean
  loading?: boolean
  hasValidInput?: boolean
  showValidationMessage?: boolean
}

interface Emits {
  generate: []
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  loading: false,
  hasValidInput: false,
  showValidationMessage: true
})

const emit = defineEmits<Emits>()

const isButtonDisabled = computed(() => {
  return props.disabled || props.loading || !props.hasValidInput
})

const handleGenerate = () => {
  if (!isButtonDisabled.value) {
    emit('generate')
  }
}
</script>