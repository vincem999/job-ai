import type { CV } from '~/types/cv'

/**
 * Client-side composable for accessing CV data
 * This composable provides reactive access to CV data on the client
 */
export function useCV() {
  /**
   * Reactive state for CV data
   */
  const cvData = ref<CV | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Fetch CV data from the server
   * @returns Promise<CV | null> The fetched CV data or null if failed
   */
  const fetchCV = async (): Promise<CV | null> => {
    if (isLoading.value) {
      return cvData.value
    }

    isLoading.value = true
    error.value = null

    try {
      // We'll need to create this API endpoint later
      const response = await $fetch<{
        success: boolean
        data?: CV
        error?: string
      }>('/api/cv')

      if (response.success && response.data) {
        cvData.value = response.data
        return response.data
      } else {
        const errorMsg = response.error || 'Failed to fetch CV data'
        error.value = errorMsg
        throw new Error(errorMsg)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred'
      error.value = errorMsg
      console.error('Failed to fetch CV:', errorMsg)
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get CV data (fetches if not already loaded)
   * @returns Promise<CV | null> The CV data or null if failed
   */
  const getCV = async (): Promise<CV | null> => {
    if (cvData.value) {
      return cvData.value
    }
    return await fetchCV()
  }

  /**
   * Clear the cached CV data
   */
  const clearCV = () => {
    cvData.value = null
    error.value = null
  }

  /**
   * Computed property for ready state
   */
  const isReady = computed(() => cvData.value !== null && !isLoading.value && error.value === null)

  /**
   * Get the status of the CV data
   */
  const status = computed(() => ({
    loaded: cvData.value !== null,
    loading: isLoading.value,
    error: error.value,
    ready: isReady.value
  }))

  return {
    // Reactive state
    cvData: readonly(cvData),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Actions
    fetchCV,
    getCV,
    clearCV,

    // Computed
    isReady,
    status
  }
}