/**
 * Integration tests for cover letter generation functionality
 * Tests the validation, sanitization, and response schemas
 */

import { describe, it, expect } from "vitest"
import { CoverLetterRequestSchema } from "../utils/validation/schemas"
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
      keywords: ["ES6+", "Async/Await"],
      yearsOfExperience: 5,
    },
    {
      id: "skill-002",
      name: "React",
      category: "framework",
      level: "advanced",
      keywords: ["Hooks", "Redux"],
      yearsOfExperience: 4,
    },
  ],
  projects: [
    {
      id: "project-001",
      name: "E-commerce Platform",
      description: "Full-stack e-commerce solution",
      role: "Lead Developer",
      startDate: new Date("2023-01-01"),
      endDate: new Date("2023-12-31"),
      isOngoing: false,
      technologies: ["React", "Node.js", "MongoDB"],
      achievements: ["Increased sales by 40%"],
      url: "https://example-ecommerce.com",
      repository: "https://github.com/johndoe/ecommerce",
    },
  ],
  certifications: [],
  languages: [],
  references: [],
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-11-06"),
  version: "1.0.0",
  isTemplate: false,
}

const validJobAnalysis = {
  requiredSkills: ["JavaScript", "React", "Node.js"],
  preferredSkills: ["TypeScript", "AWS"],
  responsibilities: [
    "Develop and maintain web applications",
    "Collaborate with cross-functional teams",
    "Code review and mentoring",
  ],
  requirements: [
    "3+ years of JavaScript experience",
    "Experience with React framework",
    "Strong problem-solving skills",
  ],
  benefits: ["Health insurance", "Remote work", "401k matching"],
  salaryRange: "$80,000 - $120,000 per year",
  workLocation: "Remote",
  workType: "Remote",
  experienceLevel: "Mid",
  industryKeywords: ["fintech", "web development", "agile"],
  matchingScore: 85,
  suggestions: ["Highlight React experience", "Mention problem-solving skills"],
}

describe("CoverLetterRequestSchema validation", () => {
  it("should validate a complete cover letter request", () => {
    const validRequest = {
      cvData: validCVData,
      jobAnalysis: validJobAnalysis,
      personalMessage: "I am very interested in this position.",
      tone: "Professional" as const,
    }

    const result = CoverLetterRequestSchema.safeParse(validRequest)
    expect(result.success).toBe(true)

    if (result.success) {
      expect(result.data.cvData.personalInfo.firstName).toBe("John")
      expect(result.data.jobAnalysis.requiredSkills).toContain("JavaScript")
      expect(result.data.personalMessage).toBe(
        "I am very interested in this position."
      )
      expect(result.data.tone).toBe("Professional")
    }
  })

  it("should validate request without optional personalMessage", () => {
    const requestWithoutMessage = {
      cvData: validCVData,
      jobAnalysis: validJobAnalysis,
      tone: "Friendly" as const,
    }

    const result = CoverLetterRequestSchema.safeParse(requestWithoutMessage)
    expect(result.success).toBe(true)

    if (result.success) {
      expect(result.data.personalMessage).toBeUndefined()
      expect(result.data.tone).toBe("Friendly")
    }
  })

  it("should use default tone when not specified", () => {
    const requestWithoutTone = {
      cvData: validCVData,
      jobAnalysis: validJobAnalysis,
    }

    const result = CoverLetterRequestSchema.safeParse(requestWithoutTone)
    expect(result.success).toBe(true)

    if (result.success) {
      expect(result.data.tone).toBe("Professional")
    }
  })

  it("should reject invalid tone", () => {
    const requestWithInvalidTone = {
      cvData: validCVData,
      jobAnalysis: validJobAnalysis,
      tone: "Casual", // Invalid tone
    }

    const result = CoverLetterRequestSchema.safeParse(requestWithInvalidTone)
    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].path).toContain("tone")
    }
  })

  it("should reject request with missing required fields", () => {
    const incompleteRequest = {
      cvData: validCVData,
      // Missing jobAnalysis
      tone: "Professional" as const,
    }

    const result = CoverLetterRequestSchema.safeParse(incompleteRequest)
    expect(result.success).toBe(false)

    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.path.includes("jobAnalysis"))
      ).toBe(true)
    }
  })

  it("should validate all available tone options", () => {
    const toneOptions = [
      "Professional",
      "Friendly",
      "Enthusiastic",
      "Formal",
    ] as const

    toneOptions.forEach((tone) => {
      const request = {
        cvData: validCVData,
        jobAnalysis: validJobAnalysis,
        tone,
      }

      const result = CoverLetterRequestSchema.safeParse(request)
      expect(result.success).toBe(true)

      if (result.success) {
        expect(result.data.tone).toBe(tone)
      }
    })
  })
})

describe("Cover letter data sanitization", () => {
  it("should sanitize personal message input", () => {
    const maliciousMessage =
      '<script>alert("xss")</script>I am interested in this role'
    const sanitized = sanitizeForDisplay(maliciousMessage)

    expect(sanitized).not.toContain("<script>")
    expect(sanitized).not.toContain("alert")
    expect(sanitized).toContain("I am interested in this role")
  })

  it("should sanitize CV personal information", () => {
    const maliciousCV = {
      ...validCVData,
      personalInfo: {
        ...validCVData.personalInfo,
        firstName: '<img src="x" onerror="alert(1)">John',
        lastName: "Doe<script>evil()</script>",
        email: 'john@example.com"><script>hack()</script>',
      },
    }

    const sanitizedFirstName = sanitizeForDisplay(
      maliciousCV.personalInfo.firstName
    )
    const sanitizedLastName = sanitizeForDisplay(
      maliciousCV.personalInfo.lastName
    )
    const sanitizedEmail = sanitizeForDisplay(maliciousCV.personalInfo.email)

    // The sanitizer encodes dangerous HTML characters and removes script tags
    expect(sanitizedFirstName).toContain("John")
    expect(sanitizedFirstName).not.toContain("<script>")
    expect(sanitizedFirstName).not.toContain("onerror")

    expect(sanitizedLastName).toContain("Doe")
    expect(sanitizedLastName).not.toContain("<script>")
    expect(sanitizedLastName).not.toContain("evil()")

    expect(sanitizedEmail).toContain("john@example.com")
    expect(sanitizedEmail).not.toContain("<script>")
    expect(sanitizedEmail).not.toContain("hack()")
  })

  it("should preserve safe HTML entities", () => {
    const textWithEntities = "I have 5+ years &amp; experience in React"
    const sanitized = sanitizeForDisplay(textWithEntities)

    expect(sanitized).toContain("5+ years")
    expect(sanitized).toContain("React")
  })
})

describe("Cover letter request integration", () => {
  it("should handle complete workflow from request to validation", () => {
    // Simulate request body transformation (like in the actual endpoint)
    const requestBody = {
      cvData: {
        ...validCVData,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-11-06T00:00:00.000Z",
        WorkExperiences: [
          {
            ...validCVData.WorkExperiences[0],
            startDate: "2020-01-01T00:00:00.000Z",
            endDate: "2023-12-31T00:00:00.000Z",
          },
        ],
        education: [
          {
            ...validCVData.education[0],
            startDate: "2016-09-01T00:00:00.000Z",
            endDate: "2020-05-15T00:00:00.000Z",
          },
        ],
        projects: [
          {
            ...validCVData.projects[0],
            startDate: "2023-01-01T00:00:00.000Z",
            endDate: "2023-12-31T00:00:00.000Z",
          },
        ],
      },
      jobAnalysis: validJobAnalysis,
      personalMessage: "I am excited about this opportunity.",
      tone: "Enthusiastic",
    }

    // Transform date strings to Date objects (like in the endpoint)
    const transformedBody = {
      ...requestBody,
      cvData: {
        ...requestBody.cvData,
        createdAt: new Date(requestBody.cvData.createdAt),
        updatedAt: new Date(requestBody.cvData.updatedAt),
        WorkExperiences: requestBody.cvData.WorkExperiences.map((exp: any) => ({
          ...exp,
          startDate: new Date(exp.startDate),
          endDate: new Date(exp.endDate),
        })),
        education: requestBody.cvData.education.map((edu: any) => ({
          ...edu,
          startDate: new Date(edu.startDate),
          endDate: new Date(edu.endDate),
        })),
        projects: requestBody.cvData.projects.map((proj: any) => ({
          ...proj,
          startDate: new Date(proj.startDate),
          endDate: new Date(proj.endDate),
        })),
      },
    }

    const validationResult = CoverLetterRequestSchema.safeParse(transformedBody)
    expect(validationResult.success).toBe(true)

    if (validationResult.success) {
      const data = validationResult.data
      expect(data.cvData.personalInfo.firstName).toBe("John")
      expect(data.jobAnalysis.requiredSkills).toContain("JavaScript")
      expect(data.personalMessage).toBe("I am excited about this opportunity.")
      expect(data.tone).toBe("Enthusiastic")
      expect(data.cvData.createdAt).toBeInstanceOf(Date)
      expect(data.cvData.WorkExperiences[0].startDate).toBeInstanceOf(Date)
    }
  })

  it("should validate minimal request with defaults", () => {
    const minimalRequest = {
      cvData: validCVData,
      jobAnalysis: validJobAnalysis,
    }

    const result = CoverLetterRequestSchema.safeParse(minimalRequest)
    expect(result.success).toBe(true)

    if (result.success) {
      expect(result.data.tone).toBe("Professional") // Default value
      expect(result.data.personalMessage).toBeUndefined()
    }
  })
})
