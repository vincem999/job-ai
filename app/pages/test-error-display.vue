<template>
  <div class="container mx-auto p-6 space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-2">ErrorDisplay Component Test</h1>
      <p class="text-gray-600">Testing various error scenarios</p>
    </div>

    <!-- String Error -->
    <section class="space-y-4">
      <h2 class="text-xl font-semibold">1. Simple String Error</h2>
      <ErrorDisplay error="This is a simple string error message" />
    </section>

    <!-- Object Error with Title and Message -->
    <section class="space-y-4">
      <h2 class="text-xl font-semibold">2. Object Error with Title</h2>
      <ErrorDisplay
        :error="{
          title: 'Validation Failed',
          message: 'Please check your input and try again.'
        }"
      />
    </section>

    <!-- HTTP Error -->
    <section class="space-y-4">
      <h2 class="text-xl font-semibold">3. HTTP Error</h2>
      <ErrorDisplay
        :error="{
          statusCode: 404,
          statusMessage: 'Not Found',
          message: 'The requested resource could not be found.'
        }"
      />
    </section>

    <!-- Warning Type -->
    <section class="space-y-4">
      <h2 class="text-xl font-semibold">4. Warning Message</h2>
      <ErrorDisplay
        :error="{
          type: 'warning',
          title: 'Data Incomplete',
          message: 'Some fields are missing but you can still proceed.'
        }"
      />
    </section>

    <!-- Info Type -->
    <section class="space-y-4">
      <h2 class="text-xl font-semibold">5. Info Message</h2>
      <ErrorDisplay
        :error="{
          type: 'info',
          title: 'Processing Update',
          message: 'Your changes are being saved automatically.'
        }"
      />
    </section>

    <!-- Dismissible Error -->
    <section class="space-y-4">
      <h2 class="text-xl font-semibold">6. Dismissible Error</h2>
      <ErrorDisplay
        v-if="showDismissibleError"
        error="This error can be dismissed"
        :dismissible="true"
        @dismiss="showDismissibleError = false"
      />
      <UButton
        v-if="!showDismissibleError"
        color="neutral"
        variant="outline"
        @click="showDismissibleError = true"
      >
        Show Dismissible Error
      </UButton>
    </section>

    <!-- Error with Retry -->
    <section class="space-y-4">
      <h2 class="text-xl font-semibold">7. Error with Retry Action</h2>
      <ErrorDisplay
        :error="{
          title: 'Connection Failed',
          message: 'Unable to connect to the server. Please try again.'
        }"
        :show-retry="true"
        retry-text="Retry Connection"
        @retry="handleRetry"
      />
      <p v-if="retryCount > 0" class="text-sm text-gray-600">
        Retry attempts: {{ retryCount }}
      </p>
    </section>

    <!-- JavaScript Error Object -->
    <section class="space-y-4">
      <h2 class="text-xl font-semibold">8. JavaScript Error Object</h2>
      <ErrorDisplay :error="jsError" />
    </section>

    <!-- Custom Props Override -->
    <section class="space-y-4">
      <h2 class="text-xl font-semibold">9. Custom Props Override</h2>
      <ErrorDisplay
        :error="{ message: 'Original error message' }"
        title="Custom Title Override"
        description="Custom description that overrides the error message"
        type="warning"
        variant="outline"
      />
    </section>

    <!-- Different Variants -->
    <section class="space-y-4">
      <h2 class="text-xl font-semibold">10. Different Variants</h2>
      <div class="space-y-3">
        <ErrorDisplay error="Solid variant" variant="solid" />
        <ErrorDisplay error="Outline variant" variant="outline" />
        <ErrorDisplay error="Soft variant (default)" variant="soft" />
        <ErrorDisplay error="Subtle variant" variant="subtle" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const showDismissibleError = ref(true)
const retryCount = ref(0)

// Create a JavaScript Error object for testing
const jsError = new Error('This is a JavaScript Error object')
jsError.name = 'ValidationError'

const handleRetry = () => {
  retryCount.value++
  console.log(`Retry attempt #${retryCount.value}`)
}
</script>