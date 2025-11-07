import { useMasterCV } from '../utils/cv/composable'

/**
 * API endpoint to serve the master CV data
 * GET /api/cv
 */
export default defineEventHandler(async (event) => {
  try {
    console.log('📄 API: Getting master CV data...')

    const { getMasterCVData, getStatus } = useMasterCV()
    const status = getStatus()

    // Check if CV is loaded and ready
    if (!status.ready) {
      console.error('❌ API: CV not ready -', status)

      return {
        success: false,
        error: status.error || 'CV data is not available',
        status
      }
    }

    // Get the CV data
    const cvData = await getMasterCVData()

    console.log('✅ API: Successfully served CV data')

    return {
      success: true,
      data: cvData,
      status: {
        loaded: true,
        ready: true,
        error: null
      }
    }
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('❌ API: Failed to get CV data:', errorMessage)

    // Set error status
    setResponseStatus(event, 500)

    return {
      success: false,
      error: errorMessage,
      status: {
        loaded: false,
        ready: false,
        error: errorMessage
      }
    }
  }
})