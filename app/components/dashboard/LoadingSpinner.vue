<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div class="flex items-center gap-3">
      <Icon
        :name="icon"
        :class="iconClass"
        class="animate-spin"
      />
      <span
        v-if="showText && text"
        :class="textClass"
        class="font-medium"
      >
        {{ text }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon?: string
  text?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  containerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'i-lucide-loader',
  text: 'Loading...',
  showText: true,
  size: 'md',
  color: 'text-primary-500',
  containerClass: 'p-4'
})

const iconClass = computed(() => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  return [
    sizeClasses[props.size],
    props.color
  ].join(' ')
})

const textClass = computed(() => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  return [
    sizeClasses[props.size],
    props.color
  ].join(' ')
})
</script>