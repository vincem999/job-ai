import { describe, it, expect } from 'vitest'
import { validateCVStructure, isCVReadyForJobApplication, getCVCompleteness } from './validator'

describe('CV Validator', () => {
  // This matches the CVSchema in schemas.ts
  const validCV = {
    personalInfo: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      location: 'New York, NY'
    },
    summary: 'Experienced developer',
    workExperience: [
      {
        company: 'Tech Corp',
        position: 'Developer',
        startDate: '2020-01-01',
        endDate: '2023-01-01',
        current: false,
        description: 'Software development',
        achievements: ['Built apps'],
        location: 'Remote'
      }
    ],
    education: [
      {
        institution: 'University',
        degree: 'Computer Science',
        field: 'CS',
        startDate: '2016-01-01',
        endDate: '2020-01-01',
        description: 'Education description'
      }
    ],
    skills: [
      {
        name: 'JavaScript',
        level: 'Expert',
        category: 'technical'
      }
    ],
    projects: [],
    certifications: [],
    languages: []
  }

  describe('validateCVStructure', () => {
    it('should validate a correct CV structure', () => {
      const result = validateCVStructure(validCV)
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should fail validation for missing required personal info', () => {
      const invalidCV = {
        ...validCV,
        personalInfo: {
          firstName: '',
          lastName: 'Doe',
          email: 'invalid-email'
        }
      }

      const result = validateCVStructure(invalidCV)
      expect(result.valid).toBe(false)
      expect(result.errors.some(error => error.includes('First name') || error.includes('firstName'))).toBe(true)
      expect(result.errors.some(error => error.includes('email') || error.includes('Email'))).toBe(true)
    })

    it('should fail validation for CV with no content', () => {
      const invalidCV = {
        ...validCV,
        workExperience: [],
        education: [],
        projects: []
      }

      const result = validateCVStructure(invalidCV)
      expect(result.valid).toBe(false)
      expect(result.errors.some(error => error.includes('work experience') || error.includes('education'))).toBe(true)
    })

    it('should validate date logic in work experience', () => {
      const invalidCV = {
        ...validCV,
        workExperience: [
          {
            ...validCV.workExperience[0],
            startDate: '2023-01-01',
            endDate: '2020-01-01' // End before start
          }
        ]
      }

      const result = validateCVStructure(invalidCV)
      expect(result.valid).toBe(false)
      expect(result.errors.some(error => error.includes('Start date') && error.includes('end date'))).toBe(true)
    })

    it('should warn about current position with end date', () => {
      const warningCV = {
        ...validCV,
        workExperience: [
          {
            ...validCV.workExperience[0],
            current: true,
            endDate: '2023-01-01'
          }
        ]
      }

      const result = validateCVStructure(warningCV)
      expect(result.valid).toBe(true)
      expect(result.warnings.some(warning => warning.includes('Current position'))).toBe(true)
    })

    it('should handle completely invalid input', () => {
      const result = validateCVStructure(null)
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should handle empty object', () => {
      const result = validateCVStructure({})
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
      expect(result.errors.some(error => error.includes('personalInfo') || error.includes('Required'))).toBe(true)
    })
  })

  describe('isCVReadyForJobApplication', () => {
    it('should return true for a complete CV', () => {
      expect(isCVReadyForJobApplication(validCV)).toBe(true)
    })

    it('should return false for invalid CV', () => {
      const invalidCV = { ...validCV, personalInfo: {} }
      expect(isCVReadyForJobApplication(invalidCV)).toBe(false)
    })

    it('should return false for CV without summary', () => {
      const incompleteCV = {
        ...validCV,
        summary: undefined
      }
      // This would generate a warning about missing professional summary
      // which would make it not ready for job application
      const result = isCVReadyForJobApplication(incompleteCV)
      expect(result).toBe(false)
    })
  })

  describe('getCVCompleteness', () => {
    it('should calculate completeness score correctly', () => {
      const completeness = getCVCompleteness(validCV)

      expect(completeness.score).toBeGreaterThan(0)
      expect(completeness.score).toBeLessThanOrEqual(100)
      expect(completeness.totalSections).toBe(7) // personalInfo, workExperience, education, skills, projects, certifications, languages
      expect(completeness.completedSections).toBeGreaterThan(0)
      expect(Array.isArray(completeness.missingRequired)).toBe(true)
      expect(Array.isArray(completeness.missingRecommended)).toBe(true)
    })

    it('should return low score for empty CV', () => {
      const emptyCV = {
        personalInfo: {},
        workExperience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: []
      }

      const completeness = getCVCompleteness(emptyCV)
      expect(completeness.score).toBe(0)
      expect(completeness.completedSections).toBe(0)
    })
  })
})