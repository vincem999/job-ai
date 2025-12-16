import type { CV } from "../../types/cv"
import { loadMasterCV } from "../utils/cv/loader"

/**
 * Nitro plugin to load the master CV at server startup
 * This makes the CV data available globally on the server
 */

// Global storage for the loaded CV
let loadedCV: CV | null = null
let loadError: Error | null = null
let isLoading = false

/**
 * Get the loaded CV data
 * @returns Promise<CV> The loaded CV data
 * @throws Error if CV loading failed or is not yet loaded
 */
export async function getMasterCV(): Promise<CV> {
  // If we have an error, throw it
  if (loadError) {
    throw loadError
  }

  // If we're currently loading, wait for completion
  if (isLoading) {
    // Simple polling mechanism - in production you might want to use a more sophisticated approach
    let attempts = 0
    while (isLoading && attempts < 50) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      attempts++
    }

    if (loadError) {
      throw loadError
    }

    if (!loadedCV) {
      throw new Error("CV loading timed out")
    }
  }

  // If we don't have the CV loaded yet, try to load it
  if (!loadedCV && !isLoading) {
    throw new Error("CV not loaded. Server may not have started properly.")
  }

  return loadedCV!
}

/**
 * Check if the CV is successfully loaded
 * @returns boolean Whether the CV is loaded and available
 */
export function isCVLoaded(): boolean {
  return loadedCV !== null && loadError === null
}

/**
 * Get the CV loading error if any
 * @returns Error | null The loading error or null if no error
 */
export function getCVLoadError(): Error | null {
  return loadError
}

export default defineNitroPlugin(async (nitroApp) => {
  console.log("🚀 Starting CV loading plugin...")

  // Load CV immediately when plugin initializes
  console.log("🔄 Loading master CV at server startup...")
  isLoading = true

  try {
    // Load the master CV with validation
    const cv = await loadMasterCV({
      validateStructure: true,
      throwOnValidationErrors: true,
      throwOnWarnings: false,
    })

    loadedCV = cv
    loadError = null

    console.log("✅ Master CV loaded successfully")
    console.log(`   - CV ID: ${cv.id}`)
    console.log(
      `   - Work Experience entries: ${cv.workExperiences?.length || 0}`
    )
    console.log(`   - Education entries: ${cv.education?.length || 0}`)
    console.log(`   - Projects: ${cv.projects?.length || 0}`)
  } catch (error) {
    loadError = error instanceof Error ? error : new Error(String(error))
    loadedCV = null

    console.error("❌ Failed to load master CV:", loadError.message)

    // Log the error but don't throw it to prevent server startup failure
    // The error will be available via getCVLoadError() for debugging
  } finally {
    isLoading = false
  }

  // Optional: Hook into request lifecycle to log CV access
  nitroApp.hooks.hook("request", (event) => {
    // Only log API routes that might use CV data
    if (event.path.startsWith("/api/")) {
      console.log(
        `📄 API request to ${event.path} - CV loaded: ${isCVLoaded()}`
      )
    }
  })
})
