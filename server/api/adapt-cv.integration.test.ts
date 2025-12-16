/**
 * Integration tests for CV adaptation functionality
 * Tests the validation, sanitization, and response schemas
 */

import { describe, it, expect } from "vitest"
import { CVAdaptationRequestSchema } from "../utils/validation/schemas"
import { sanitizeForDisplay } from "../utils/validation/sanitize"

// Test data
const validCVData = {
  id: "test-cv-001",
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    summary:
      "Experienced software developer with 5+ years in web technologies.",
  },
  WorkExperiences: [
    {
      id: "work-001",
      company: "Tech Solutions Inc.",
      position: "Software Developer",
      startDate: new Date("2020-01-01"),
      endDate: new Date("2023-12-31"),
      isCurrentPosition: false,
      location: "San Francisco, CA",
      description: "Developed web applications using JavaScript and React.",
      achievements: [
        "Built user-friendly interfaces for 50,000+ users",
        "Improved application performance by 30%",
      ],
      skills: ["JavaScript", "React", "Node.js"],
      technologies: ["React", "Node.js", "MongoDB"],
    },
  ],
  education: [
    {
      id: "edu-001",
      institution: "University of California",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: new Date("2016-09-01"),
      endDate: new Date("2020-05-15"),
      isCurrentEducation: false,
      honors: ["Cum Laude"],
      relevantCourses: ["Data Structures", "Algorithms"],
    },
  ],
  skills: [
    {
      id: "skill-001",
      name: "JavaScript",
      category: "technical",
      level: "expert",
      keywords: ["ES6", "Async/Await"],
    },
    {
      id: "skill-002",
      name: "React",
      category: "framework",
      level: "advanced",
      keywords: ["Hooks", "Components"],
    },
  ],
  certifications: [],
  projects: [],
  languages: [],
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-11-01"),
  version: "1.0.0",
}

const validJobAnalysis = {
  requiredSkills: ["JavaScript", "React", "TypeScript", "Node.js"],
  preferredSkills: ["AWS", "Docker", "GraphQL"],
  responsibilities: [
    "Develop and maintain web applications",
    "Collaborate with cross-functional teams",
    "Write clean, maintainable code",
    "Participate in code reviews",
  ],
  requirements: [
    "3+ years of experience in JavaScript",
    "Strong knowledge of React framework",
    "Experience with backend technologies",
    "Bachelor's degree in Computer Science or related field",
  ],
  benefits: ["Health insurance", "401k matching", "Remote work flexibility"],
  salaryRange: "$80,000 - $120,000 per year",
  workLocation: "San Francisco, CA (Remote options available)",
  workType: "Hybrid",
  experienceLevel: "Mid",
  industryKeywords: ["fintech", "saas", "web development", "startup"],
  suggestions: [
    "Highlight React and JavaScript expertise",
    "Emphasize team collaboration skills",
    "Show quantifiable achievements",
  ],
}

describe("CV Adaptation Integration Tests", () => {
  describe("Request Validation", () => {
    it("should validate a complete CV adaptation request", () => {
      const requestData = {
        cvData: validCVData,
        jobAnalysis: validJobAnalysis,
        focusAreas: ["technical skills", "achievements"],
      }

      const result = CVAdaptationRequestSchema.safeParse(requestData)
      expect(result.success).toBe(true)

      if (result.success) {
        expect(result.data.cvData.id).toBe("test-cv-001")
        expect(result.data.jobAnalysis.requiredSkills).toContain("JavaScript")
        expect(result.data.focusAreas).toContain("technical skills")
      }
    })

    it("should validate CV adaptation request without focus areas", () => {
      const requestData = {
        cvData: validCVData,
        jobAnalysis: validJobAnalysis,
      }

      const result = CVAdaptationRequestSchema.safeParse(requestData)
      expect(result.success).toBe(true)
    })

    it("should reject request with missing CV data", () => {
      const requestData = {
        jobAnalysis: validJobAnalysis,
      }

      const result = CVAdaptationRequestSchema.safeParse(requestData)
      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error.issues[0].path).toContain("cvData")
      }
    })

    it("should reject request with missing job analysis", () => {
      const requestData = {
        cvData: validCVData,
      }

      const result = CVAdaptationRequestSchema.safeParse(requestData)
      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error.issues[0].path).toContain("jobAnalysis")
      }
    })

    it("should reject CV with missing required personal info", () => {
      const invalidCVData = {
        ...validCVData,
        personalInfo: {
          firstName: "John",
          // Missing lastName and email
        },
      }

      const requestData = {
        cvData: invalidCVData,
        jobAnalysis: validJobAnalysis,
      }

      const result = CVAdaptationRequestSchema.safeParse(requestData)
      expect(result.success).toBe(false)
    })

    it("should reject job analysis with missing required fields", () => {
      const invalidJobAnalysis = {
        preferredSkills: ["JavaScript"],
        // Missing requiredSkills, responsibilities, requirements
      }

      const requestData = {
        cvData: validCVData,
        jobAnalysis: invalidJobAnalysis,
      }

      const result = CVAdaptationRequestSchema.safeParse(requestData)
      expect(result.success).toBe(false)
    })
  })

  describe("Data Sanitization", () => {
    it("should sanitize potentially malicious CV data", () => {
      const maliciousCV = {
        ...validCVData,
        personalInfo: {
          ...validCVData.personalInfo,
          firstName: 'John<script>alert("xss")</script>',
          lastName: 'Doe<img src="x" onerror="alert(1)">',
          summary: "Developer with <script>malicious code</script> experience",
        },
        WorkExperiences: [
          {
            ...validCVData.WorkExperiences[0],
            company: 'Evil Corp<script>alert("hack")</script>',
            description: "Worked on <script>evil</script> projects",
          },
        ],
      }

      // Simulate the sanitization that happens in the API
      const sanitizedCV = {
        ...maliciousCV,
        personalInfo: {
          ...maliciousCV.personalInfo,
          firstName: sanitizeForDisplay(maliciousCV.personalInfo.firstName),
          lastName: sanitizeForDisplay(maliciousCV.personalInfo.lastName),
          summary: maliciousCV.personalInfo.summary
            ? sanitizeForDisplay(maliciousCV.personalInfo.summary)
            : undefined,
        },
        WorkExperiences: maliciousCV.WorkExperiences.map((exp) => ({
          ...exp,
          company: sanitizeForDisplay(exp.company),
          description: sanitizeForDisplay(exp.description),
        })),
      }

      expect(sanitizedCV.personalInfo.firstName).not.toContain("<script>")
      expect(sanitizedCV.personalInfo.lastName).not.toContain("<img")
      expect(sanitizedCV.personalInfo.summary).not.toContain("<script>")
      expect(sanitizedCV.WorkExperiences[0].company).not.toContain("<script>")
      expect(sanitizedCV.WorkExperiences[0].description).not.toContain(
        "<script>"
      )

      // Should still contain safe content
      expect(sanitizedCV.personalInfo.firstName).toContain("John")
      expect(sanitizedCV.personalInfo.lastName).toContain("Doe")
      expect(sanitizedCV.WorkExperiences[0].company).toContain("Evil Corp")
    })

    it("should preserve safe HTML entities", () => {
      const cvWithEntities = {
        ...validCVData,
        personalInfo: {
          ...validCVData.personalInfo,
          summary: "Developer at Johnson & Johnson with 5+ years experience",
        },
      }

      const sanitizedSummary = sanitizeForDisplay(
        cvWithEntities.personalInfo.summary
      )

      expect(sanitizedSummary).toContain("Johnson &amp; Johnson")
      expect(sanitizedSummary).toContain("5+ years")
    })

    it("should handle empty and null values gracefully", () => {
      expect(() => sanitizeForDisplay("")).not.toThrow()
      expect(sanitizeForDisplay("")).toBe("")

      // The sanitize function should throw for non-strings
      expect(() => sanitizeForDisplay(null as any)).toThrow()
      expect(() => sanitizeForDisplay(undefined as any)).toThrow()
    })
  })

  describe("Date Transformation", () => {
    it("should handle date string to Date object conversion", () => {
      const cvWithDateStrings = {
        ...validCVData,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-11-01T00:00:00.000Z",
        WorkExperiences: [
          {
            ...validCVData.WorkExperiences[0],
            startDate: "2020-01-01T00:00:00.000Z",
            endDate: "2023-12-31T00:00:00.000Z",
          },
        ],
      }

      // Simulate the date transformation logic from the API
      const transformedCV = {
        ...cvWithDateStrings,
        createdAt: new Date(cvWithDateStrings.createdAt),
        updatedAt: new Date(cvWithDateStrings.updatedAt),
        WorkExperiences: cvWithDateStrings.WorkExperiences.map((exp) => ({
          ...exp,
          startDate: new Date(exp.startDate),
          endDate: exp.endDate ? new Date(exp.endDate) : undefined,
        })),
      }

      expect(transformedCV.createdAt).toBeInstanceOf(Date)
      expect(transformedCV.updatedAt).toBeInstanceOf(Date)
      expect(transformedCV.WorkExperiences[0].startDate).toBeInstanceOf(Date)
      expect(transformedCV.WorkExperiences[0].endDate).toBeInstanceOf(Date)

      // Should validate successfully after transformation
      const validationResult = CVAdaptationRequestSchema.safeParse({
        cvData: transformedCV,
        jobAnalysis: validJobAnalysis,
      })
      expect(validationResult.success).toBe(true)
    })

    it("should handle invalid date strings gracefully", () => {
      expect(() => new Date("invalid-date")).not.toThrow()

      const invalidDate = new Date("invalid-date")
      expect(isNaN(invalidDate.getTime())).toBe(true)

      // Validation should catch invalid dates
      const cvWithInvalidDate = {
        ...validCVData,
        createdAt: new Date("invalid-date"),
      }

      const validationResult = CVAdaptationRequestSchema.safeParse({
        cvData: cvWithInvalidDate,
        jobAnalysis: validJobAnalysis,
      })
      expect(validationResult.success).toBe(false)
    })
  })

  describe("Focus Areas Processing", () => {
    it("should handle valid focus areas", () => {
      const focusAreas = [
        "technical skills",
        "leadership experience",
        "achievements",
      ]

      const sanitizedFocusAreas = focusAreas.map((area) =>
        sanitizeForDisplay(area)
      )

      expect(sanitizedFocusAreas).toHaveLength(3)
      expect(sanitizedFocusAreas).toContain("technical skills")
      expect(sanitizedFocusAreas).toContain("leadership experience")
      expect(sanitizedFocusAreas).toContain("achievements")
    })

    it("should sanitize malicious focus areas", () => {
      const maliciousFocusAreas = [
        'technical skills<script>alert("xss")</script>',
        'leadership<img src="x" onerror="alert(1)">',
      ]

      const sanitizedFocusAreas = maliciousFocusAreas.map((area) =>
        sanitizeForDisplay(area)
      )

      expect(sanitizedFocusAreas[0]).not.toContain("<script>")
      expect(sanitizedFocusAreas[1]).not.toContain("<img")
      expect(sanitizedFocusAreas[0]).toContain("technical skills")
      expect(sanitizedFocusAreas[1]).toContain("leadership")
    })
  })

  describe("Complex Validation Scenarios", () => {
    it("should validate CV with all optional fields included", () => {
      const complexCV = {
        ...validCVData,
        personalInfo: {
          ...validCVData.personalInfo,
          address: {
            street: "123 Main St",
            city: "San Francisco",
            state: "CA",
            zipCode: "94105",
            country: "United States",
          },
          linkedin: "https://linkedin.com/in/johndoe",
          github: "https://github.com/johndoe",
          website: "https://johndoe.dev",
        },
        certifications: [
          {
            id: "cert-001",
            name: "AWS Certified Developer",
            issuer: "Amazon",
            issueDate: new Date("2023-01-01"),
            expiryDate: new Date("2026-01-01"),
            credentialId: "AWS-123456",
            verificationUrl: "https://aws.amazon.com/verification",
            description: "Cloud development certification",
          },
        ],
        projects: [
          {
            id: "proj-001",
            name: "E-commerce Platform",
            description: "Built a full-stack e-commerce solution",
            startDate: new Date("2023-01-01"),
            endDate: new Date("2023-06-01"),
            isCurrentProject: false,
            technologies: ["React", "Node.js", "PostgreSQL"],
            achievements: ["Handled 10k+ transactions"],
            url: "https://myproject.com",
            github: "https://github.com/johndoe/ecommerce",
          },
        ],
        languages: [
          {
            id: "lang-001",
            name: "English",
            level: "native",
            certifications: [],
          },
          {
            id: "lang-002",
            name: "Spanish",
            level: "conversational",
            certifications: ["DELE B2"],
          },
        ],
      }

      const validationResult = CVAdaptationRequestSchema.safeParse({
        cvData: complexCV,
        jobAnalysis: validJobAnalysis,
      })

      expect(validationResult.success).toBe(true)
    })

    it("should validate minimal CV with only required fields", () => {
      const minimalCV = {
        id: "minimal-cv",
        personalInfo: {
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@example.com",
        },
        WorkExperiences: [],
        education: [],
        skills: [],
        certifications: [],
        projects: [],
        languages: [],
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        version: "1.0",
      }

      const validationResult = CVAdaptationRequestSchema.safeParse({
        cvData: minimalCV,
        jobAnalysis: validJobAnalysis,
      })

      expect(validationResult.success).toBe(true)
    })

    it("should validate job analysis with optional fields", () => {
      const complexJobAnalysis = {
        ...validJobAnalysis,
        benefits: ["Health insurance", "401k", "Stock options"],
        salaryRange: "$80,000 - $120,000",
        workLocation: "San Francisco, CA",
        workType: "Remote" as const,
        experienceLevel: "Senior" as const,
        matchingScore: 85,
      }

      const validationResult = CVAdaptationRequestSchema.safeParse({
        cvData: validCVData,
        jobAnalysis: complexJobAnalysis,
      })

      expect(validationResult.success).toBe(true)
    })
  })

  describe("Error Message Quality", () => {
    it("should provide clear error messages for validation failures", () => {
      const invalidRequest = {
        cvData: {
          id: "test",
          // Missing personalInfo
          WorkExperiences: [],
          education: [],
          skills: [],
        },
        jobAnalysis: {
          // Missing requiredSkills
          preferredSkills: ["JavaScript"],
        },
      }

      const result = CVAdaptationRequestSchema.safeParse(invalidRequest)
      expect(result.success).toBe(false)

      if (!result.success) {
        const errorPaths = result.error.issues.map((issue) =>
          issue.path.join(".")
        )
        expect(
          errorPaths.some((path) => path.includes("cvData.personalInfo"))
        ).toBe(true)
        expect(
          errorPaths.some((path) => path.includes("jobAnalysis.requiredSkills"))
        ).toBe(true)
      }
    })
  })
})
