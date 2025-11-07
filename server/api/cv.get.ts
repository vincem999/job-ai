import { defineEventHandler } from 'h3'
import { useMasterCV } from '../utils/cv/composable'
import { handleError, createError } from '../utils/errorHandler'

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

      throw createError.server(
        status.error || 'CV data is not available',
        status.error ? new Error(status.error) : undefined
      )
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
    console.error('❌ API: Failed to get CV data:', error)
    return handleError(error, event)
  }
})