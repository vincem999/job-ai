import type { CV } from '../../../types/cv'
import { getMasterCV, isCVLoaded, getCVLoadError } from '../../plugins/loadCV'

/**
 * Server-side composable for accessing the loaded master CV
 * This composable provides access to the CV data loaded at server startup
 */
export function useMasterCV() {
  /**
   * Get the loaded master CV data
   * @returns Promise<CV> The master CV data
   * @throws Error if CV is not loaded or loading failed
   */
  const getMasterCVData = async (): Promise<CV> => {
    try {
      return await getMasterCV()
    } catch (error) {
      throw new Error(`Failed to get master CV: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Check if the master CV is loaded and available
   * @returns boolean Whether the CV is successfully loaded
   */
  const isReady = (): boolean => {
    return isCVLoaded()
  }

  /**
   * Get any error that occurred during CV loading
   * @returns Error | null The loading error or null if no error
   */
  const getError = (): Error | null => {
    return getCVLoadError()
  }

  /**
   * Get CV loading status information
   * @returns object Status information including loaded state and error
   */
  const getStatus = () => {
    const error = getError()
    const loaded = isReady()

    return {
      loaded,
      error: error?.message || null,
      ready: loaded && !error
    }
  }

  return {
    getMasterCVData,
    isReady,
    getError,
    getStatus
  }
}