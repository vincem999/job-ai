<template>
  <div v-if="error" class="w-full">
    <UAlert
      :title="displayTitle"
      :description="displayDescription"
      :color="alertColor"
      :variant="variant"
      :icon="alertIcon"
      :close="dismissible"
      :actions="actions"
      :class="alertClass"
      @update:open="handleDismiss"
    />
  </div>
</template>

<script setup lang="ts">
interface ErrorData {
  title?: string
  message?: string
  details?: string
  type?: 'error' | 'warning' | 'info'
  statusCode?: number
  statusMessage?: string
  code?: string
}

interface Props {
  error?: ErrorData | string | Error | null
  title?: string
  description?: string
  type?: 'error' | 'warning' | 'info'
  dismissible?: boolean
  variant?: 'solid' | 'outline' | 'soft' | 'subtle'
  showRetry?: boolean
  retryText?: string
  class?: string
}

interface Emits {
  dismiss: []
  retry: []
}

const props = withDefaults(defineProps<Props>(), {
  error: null,
  title: undefined,
  description: undefined,
  type: 'error',
  dismissible: false,
  variant: 'soft',
  showRetry: false,
  retryText: 'Try Again',
  class: ''
})

const emit = defineEmits<Emits>()

const displayTitle = computed(() => {
  if (props.title) return props.title

  if (typeof props.error === 'string') {
    return getDefaultTitle(props.type)
  }

  if (props.error && typeof props.error === 'object') {
    const errorObj = props.error as ErrorData | Error

    if ('title' in errorObj && errorObj.title) {
      return errorObj.title
    }

    if ('statusMessage' in errorObj && errorObj.statusMessage) {
      return errorObj.statusMessage
    }

    if ('name' in errorObj && errorObj.name) {
      return errorObj.name
    }

    if ('statusCode' in errorObj && errorObj.statusCode) {
      return `Error ${errorObj.statusCode}`
    }
  }

  return getDefaultTitle(props.type)
})

const displayDescription = computed(() => {
  if (props.description) return props.description

  if (typeof props.error === 'string') {
    return props.error
  }

  if (props.error && typeof props.error === 'object') {
    const errorObj = props.error as ErrorData | Error

    if ('message' in errorObj && errorObj.message) {
      return errorObj.message
    }

    if ('details' in errorObj && errorObj.details) {
      return errorObj.details
    }
  }

  return getDefaultDescription(props.type)
})

const alertColor = computed(() => {
  const errorType = getErrorType()

  switch (errorType) {
    case 'warning':
      return 'warning'
    case 'info':
      return 'info'
    case 'error':
    default:
      return 'error'
  }
})

const alertIcon = computed(() => {
  const errorType = getErrorType()

  switch (errorType) {
    case 'warning':
      return 'i-lucide-triangle-alert'
    case 'info':
      return 'i-lucide-info'
    case 'error':
    default:
      return 'i-lucide-x-circle'
  }
})

const alertClass = computed(() => {
  return props.class
})

const actions = computed(() => {
  const actionsList: any[] = []

  if (props.showRetry) {
    actionsList.push({
      label: props.retryText,
      color: alertColor.value as 'error' | 'info' | 'warning',
      variant: 'outline' as const,
      click: () => emit('retry')
    })
  }

  return actionsList.length > 0 ? actionsList : undefined
})

function getErrorType(): 'error' | 'warning' | 'info' {
  if (props.type) return props.type

  if (props.error && typeof props.error === 'object' && 'type' in props.error) {
    return (props.error as ErrorData).type || 'error'
  }

  return 'error'
}

function getDefaultTitle(type: 'error' | 'warning' | 'info'): string {
  switch (type) {
    case 'warning':
      return 'Warning'
    case 'info':
      return 'Information'
    case 'error':
    default:
      return 'Error'
  }
}

function getDefaultDescription(type: 'error' | 'warning' | 'info'): string {
  switch (type) {
    case 'warning':
      return 'Please review the information below.'
    case 'info':
      return 'Here is some important information.'
    case 'error':
    default:
      return 'Something went wrong. Please try again.'
  }
}

function handleDismiss() {
  emit('dismiss')
}
</script>