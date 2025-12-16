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

    // Convert date strings back to Date objects
    const parsedCV = parseCV(cvData)

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

    // Convert date strings back to Date objects
    const parsedCV = parseCV(cvData)

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

/**
 * Parse CV data and convert date strings to Date objects
 * @param data Raw CV data from JSON
 * @returns CV with properly typed dates
 */
const parseCV = (data: any): CV => {
  // Parse dates in work experience
  if (data.WorkExperiences) {
    data.WorkExperiences = data.WorkExperiences.map((exp: any) => ({
      ...exp,
      startDate: new Date(exp.startDate),
      endDate: exp.endDate ? new Date(exp.endDate) : undefined,
    }))
  }

  // Parse dates in education
  if (data.education) {
    data.education = data.education.map((edu: any) => ({
      ...edu,
      startDate: new Date(edu.startDate),
      endDate: edu.endDate ? new Date(edu.endDate) : undefined,
    }))
  }

  // Parse dates in projects
  if (data.projects) {
    data.projects = data.projects.map((project: any) => ({
      ...project,
      startDate: new Date(project.startDate),
      endDate: project.endDate ? new Date(project.endDate) : undefined,
    }))
  }

  // Parse dates in certifications
  if (data.certifications) {
    data.certifications = data.certifications.map((cert: any) => ({
      ...cert,
      issueDate: new Date(cert.issueDate),
      expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : undefined,
    }))
  }

  // Parse main CV dates
  return {
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  } as CV
}
