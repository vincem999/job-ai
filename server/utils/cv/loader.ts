import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { CV } from '../../../types/cv'

/**
 * Load the master CV data from the JSON file
 * @returns Promise<CV> The parsed CV data
 * @throws Error if file reading or JSON parsing fails
 */
export async function loadMasterCV(): Promise<CV> {
  try {
    // Read the JSON file from the templates directory
    const filePath = resolve(process.cwd(), 'templates', 'master-cv-data.json')
    const fileContent = await readFile(filePath, 'utf-8')

    // Parse the JSON data
    const cvData = JSON.parse(fileContent)

    // Convert date strings back to Date objects
    const parsedCV = parseCV(cvData)

    return parsedCV
  }
  catch (error) {
    throw new Error(`Failed to load master CV: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Parse CV data and convert date strings to Date objects
 * @param data Raw CV data from JSON
 * @returns CV with properly typed dates
 */
function parseCV(data: any): CV {
  // Parse dates in work experience
  if (data.workExperience) {
    data.workExperience = data.workExperience.map((exp: any) => ({
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