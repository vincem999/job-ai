import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import type { CV } from "../../../types/cv"
import { validateCVStructure, type CVValidationResult } from "./validator"

/**
 * Options for loading CV data
 */
export interface LoadCVOptions {
  /** Whether to validate the CV structure (default: true) */
  validateStructure?: boolean
  /** Whether to throw errors on validation failures (default: true) */
  throwOnValidationErrors?: boolean
  /** Whether to throw errors on validation warnings (default: false) */
  throwOnWarnings?: boolean
}

/**
 * Load the master CV data from the JSON file with validation
 * @param options Configuration options for loading
 * @returns Promise<CV> The parsed and validated CV data
 * @throws Error if file reading, JSON parsing, or validation fails
 */
export async function loadMasterCV(options: LoadCVOptions = {}): Promise<CV> {
  const {
    validateStructure = true,
    throwOnValidationErrors = true,
    throwOnWarnings = false,
  } = options

  try {
    // Read the JSON file from the templates directory
    const filePath = resolve(process.cwd(), "templates", "master-cv-data.json")
    const fileContent = await readFile(filePath, "utf-8")

    // Parse the JSON data
    const cvData = JSON.parse(fileContent)

    // No need to parse dates since they remain as strings
    const parsedCV = cvData as CV

    // Validate structure if requested
    if (validateStructure) {
      const validation = validateCVStructure(parsedCV)

      // Log validation results
      if (validation.warnings.length > 0) {
        console.warn("CV validation warnings:", validation.warnings)
      }

      if (!validation.valid) {
        const errorMessage = `CV validation failed: ${validation.errors.join(
          "; "
        )}`
        if (throwOnValidationErrors) {
          throw new Error(errorMessage)
        }
        console.error(errorMessage)
      }

      if (validation.warnings.length > 0 && throwOnWarnings) {
        const warningMessage = `CV validation warnings: ${validation.warnings.join(
          "; "
        )}`
        throw new Error(warningMessage)
      }
    }

    return parsedCV
  } catch (error) {
    throw new Error(
      `Failed to load master CV: ${
        error instanceof Error ? error.message : String(error)
      }`
    )
  }
}

/**
 * Load and validate master CV, returning both the CV and validation results
 * @param options Configuration options for loading
 * @returns Promise containing CV data and validation results
 */
export async function loadMasterCVWithValidation(
  options: LoadCVOptions = {}
): Promise<{
  cv: CV
  validation: CVValidationResult
}> {
  const { validateStructure = true } = options

  try {
    // Read the JSON file from the templates directory
    const filePath = resolve(process.cwd(), "templates", "master-cv-data.json")
    const fileContent = await readFile(filePath, "utf-8")

    // Parse the JSON data
    const cvData = JSON.parse(fileContent)

    // No need to parse dates since they remain as strings
    const parsedCV = cvData as CV

    // Always validate when using this function
    const validation = validateStructure
      ? validateCVStructure(parsedCV)
      : { valid: true, errors: [], warnings: [] }

    return {
      cv: parsedCV,
      validation,
    }
  } catch (error) {
    throw new Error(
      `Failed to load master CV: ${
        error instanceof Error ? error.message : String(error)
      }`
    )
  }
}

