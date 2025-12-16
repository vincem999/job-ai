/**
 * Tests for OpenAI prompt generation utilities
 * Tests prompt generation for job analysis, CV adaptation, and cover letters
 */

import { describe, it, expect } from "vitest"
import {
  generateJobAnalysisPrompt,
  generateCVAdaptationPrompt,
  generateCoverLetterPrompt,
  validatePromptTemplate,
} from "./prompts"
import type {
  JobAnalysisRequest,
  JobAnalysisResponse,
  CVData,
  CoverLetterRequest,
} from "../validation/schemas"

// Mock data for testing
const mockJobAnalysisRequest: JobAnalysisRequest = {
  jobOffer: `
    Software Engineer - Full Stack

    We are looking for a passionate Software Engineer to join our team.

    Requirements:
    - 3+ years of experience in JavaScript/TypeScript
    - Experience with React, Node.js
    - Knowledge of database systems (PostgreSQL, MongoDB)
    - Strong problem-solving skills
    - Bachelor's degree in Computer Science or related field

    Preferred:
    - Experience with cloud platforms (AWS, GCP)
    - Knowledge of Docker and Kubernetes
    - Previous startup experience

    We offer competitive salary, health insurance, and remote work options.
  `,
  company: "TechCorp Inc",
  position: "Full Stack Software Engineer",
  additionalContext: "Fast-growing startup in the fintech space",
}

const mockJobAnalysisResponse: JobAnalysisResponse = {
  requiredSkills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "PostgreSQL",
    "MongoDB",
  ],
  preferredSkills: ["AWS", "GCP", "Docker", "Kubernetes"],
  responsibilities: [
    "Develop full-stack web applications",
    "Work with databases and APIs",
    "Collaborate with cross-functional teams",
  ],
  requirements: [
    "3+ years of experience in JavaScript/TypeScript",
    "Bachelor's degree in Computer Science or related field",
    "Strong problem-solving skills",
  ],
  benefits: ["Competitive salary", "Health insurance", "Remote work options"],
  salaryRange: "Not specified",
  workLocation: "Remote",
  workType: "Remote",
  experienceLevel: "Mid",
  industryKeywords: ["fintech", "startup", "full-stack"],
  suggestions: [
    "Highlight JavaScript/TypeScript experience prominently",
    "Emphasize database experience",
    "Show examples of full-stack projects",
  ],
}

const mockCVData: CVData = {
  id: "cv-123",
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1-555-0123",
    address: {
      city: "San Francisco",
      country: "USA",
    },
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
    summary:
      "Experienced software engineer with 4 years of full-stack development experience",
  },
  WorkExperiences: [
    {
      id: "exp-1",
      company: "Previous Company",
      position: "Senior Developer",
      startDate: new Date("2020-01-01"),
      endDate: new Date("2023-12-31"),
      isCurrentPosition: false,
      location: "Remote",
      description:
        "Developed scalable web applications using React and Node.js",
      achievements: [
        "Improved application performance by 40%",
        "Led team of 3 developers",
      ],
      skills: ["JavaScript", "React", "Node.js"],
      technologies: ["React", "Node.js", "PostgreSQL", "AWS"],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of Technology",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: new Date("2016-09-01"),
      endDate: new Date("2020-06-01"),
      isCurrentEducation: false,
      gpa: 3.8,
      honors: ["Magna Cum Laude"],
      relevantCourses: ["Data Structures", "Algorithms", "Database Systems"],
      description: "Specialized in software engineering and database systems",
    },
  ],
  skills: [
    {
      id: "skill-1",
      name: "JavaScript",
      level: "advanced",
      category: "Programming Languages",
      keywords: ["ES6", "TypeScript", "Node.js"],
      yearsOfExperience: 4,
    },
    {
      id: "skill-2",
      name: "React",
      level: "advanced",
      category: "Frontend Frameworks",
      keywords: ["Redux", "Hooks", "Context API"],
      yearsOfExperience: 3,
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Solutions Architect Associate",
      issuer: "Amazon Web Services",
      issueDate: new Date("2022-06-01"),
      credentialId: "ABC-123",
      description: "Cloud architecture and AWS services certification",
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "E-commerce Platform",
      description:
        "Built a full-stack e-commerce platform with React and Node.js",
      startDate: new Date("2023-01-01"),
      endDate: new Date("2023-06-01"),
      isCurrentProject: false,
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe API"],
      role: "Full-stack Developer",
      achievements: ["Processed 10,000+ orders", "Integrated payment gateway"],
      url: "https://ecommerce-demo.com",
      github: "https://github.com/johndoe/ecommerce",
    },
  ],
  languages: [
    {
      id: "lang-1",
      name: "English",
      level: "native",
      certifications: [],
    },
  ],
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-15"),
  version: "1.0",
}

const mockCoverLetterRequest: CoverLetterRequest = {
  cvData: mockCVData,
  jobAnalysis: mockJobAnalysisResponse,
  personalMessage:
    "I am particularly excited about the opportunity to work in fintech",
  tone: "Professional",
}

describe("generateJobAnalysisPrompt", () => {
  it("should generate a valid prompt with required elements", () => {
    const prompt = generateJobAnalysisPrompt(mockJobAnalysisRequest)

    expect(prompt).toContain("job offer")
    expect(prompt).toContain("JSON")
    expect(prompt).toContain("requiredSkills")
    expect(prompt).toContain("preferredSkills")
    expect(prompt).toContain("responsibilities")
    expect(prompt).toContain(mockJobAnalysisRequest.jobOffer)
    expect(prompt).toContain(mockJobAnalysisRequest.company)
    expect(prompt).toContain(mockJobAnalysisRequest.position)
  })

  it("should include additional context when provided", () => {
    const config = { context: "This is a high-priority role" }
    const prompt = generateJobAnalysisPrompt(mockJobAnalysisRequest, config)

    expect(prompt).toContain("This is a high-priority role")
  })

  it("should handle minimal job analysis request", () => {
    const minimalRequest: JobAnalysisRequest = {
      jobOffer: "Looking for a developer with Python skills",
    }

    const prompt = generateJobAnalysisPrompt(minimalRequest)
    expect(prompt).toContain("Python skills")
    expect(prompt).toContain("JSON")
  })

  it("should include proper JSON structure requirements", () => {
    const prompt = generateJobAnalysisPrompt(mockJobAnalysisRequest)

    const jsonStructure = [
      "requiredSkills",
      "preferredSkills",
      "responsibilities",
      "requirements",
      "benefits",
      "salaryRange",
      "workLocation",
      "workType",
      "experienceLevel",
      "industryKeywords",
      "matchingScore",
      "suggestions",
    ]

    jsonStructure.forEach((field) => {
      expect(prompt).toContain(field)
    })
  })
})

describe("generateCVAdaptationPrompt", () => {
  it("should generate a valid CV adaptation prompt", () => {
    const prompt = generateCVAdaptationPrompt(
      mockCVData,
      mockJobAnalysisResponse
    )

    expect(prompt).toContain("CV")
    expect(prompt).toContain("adapt")
    expect(prompt).toContain("job requirements")
    expect(prompt).toContain("JSON")
    expect(prompt).toContain(mockCVData.personalInfo.firstName)
    expect(prompt).toContain(mockJobAnalysisResponse.requiredSkills[0])
  })

  it("should include focus areas when provided", () => {
    const focusAreas = ["technical skills", "leadership experience"]
    const prompt = generateCVAdaptationPrompt(
      mockCVData,
      mockJobAnalysisResponse,
      focusAreas
    )

    expect(prompt).toContain("technical skills")
    expect(prompt).toContain("leadership experience")
  })

  it("should respect maxLength configuration", () => {
    const config = { maxLength: 1000 }
    const prompt = generateCVAdaptationPrompt(
      mockCVData,
      mockJobAnalysisResponse,
      [],
      config
    )

    expect(prompt).toContain("1000 characters")
  })

  it("should include required output structure", () => {
    const prompt = generateCVAdaptationPrompt(
      mockCVData,
      mockJobAnalysisResponse
    )

    const requiredFields = [
      "adaptedPersonalInfo",
      "prioritizedWorkExperience",
      "optimizedSkills",
      "recommendedSections",
      "keywordOptimization",
      "improvementSuggestions",
      "overallMatchScore",
    ]

    requiredFields.forEach((field) => {
      expect(prompt).toContain(field)
    })
  })

  it("should include CV data and job analysis in structured format", () => {
    const prompt = generateCVAdaptationPrompt(
      mockCVData,
      mockJobAnalysisResponse
    )

    // Check that CV data is included
    expect(prompt).toContain(mockCVData.personalInfo.email)
    expect(prompt).toContain(mockCVData.WorkExperiences[0].company)

    // Check that job analysis data is included
    mockJobAnalysisResponse.requiredSkills.forEach((skill) => {
      expect(prompt).toContain(skill)
    })
  })
})

describe("generateCoverLetterPrompt", () => {
  it("should generate a valid cover letter prompt", () => {
    const prompt = generateCoverLetterPrompt(mockCoverLetterRequest)

    expect(prompt).toContain("cover letter")
    expect(prompt).toContain("Professional")
    expect(prompt).toContain(mockCoverLetterRequest.personalMessage)
    expect(prompt).toContain("JSON")
  })

  it("should include tone-specific instructions", () => {
    const enthusiasticRequest: CoverLetterRequest = {
      ...mockCoverLetterRequest,
      tone: "Enthusiastic",
    }

    const prompt = generateCoverLetterPrompt(enthusiasticRequest)
    expect(prompt.toLowerCase()).toContain("enthusiastic")
    expect(prompt.toLowerCase()).toContain("excitement")
  })

  it("should respect maxLength configuration", () => {
    const config = { maxLength: 500 }
    const prompt = generateCoverLetterPrompt(mockCoverLetterRequest, config)

    expect(prompt).toContain("500 words")
  })

  it("should include cover letter structure requirements", () => {
    const prompt = generateCoverLetterPrompt(mockCoverLetterRequest)

    const structureElements = [
      "Opening Paragraph",
      "Body Paragraph 1",
      "Body Paragraph 2",
      "Closing Paragraph",
    ]

    structureElements.forEach((element) => {
      expect(prompt).toContain(element)
    })
  })

  it("should include required output JSON structure", () => {
    const prompt = generateCoverLetterPrompt(mockCoverLetterRequest)

    const requiredFields = [
      "coverLetter",
      "header",
      "content",
      "fullText",
      "wordCount",
      "keyHighlights",
      "matchingElements",
      "suggestions",
    ]

    requiredFields.forEach((field) => {
      expect(prompt).toContain(field)
    })
  })

  it("should handle different tones correctly", () => {
    const tones: Array<CoverLetterRequest["tone"]> = [
      "Professional",
      "Friendly",
      "Enthusiastic",
      "Formal",
    ]

    tones.forEach((tone) => {
      const request: CoverLetterRequest = {
        ...mockCoverLetterRequest,
        tone,
      }

      const prompt = generateCoverLetterPrompt(request)
      expect(prompt.toLowerCase()).toContain(tone.toLowerCase())
    })
  })
})

describe("validatePromptTemplate", () => {
  it("should validate job analysis prompts correctly", () => {
    const validPrompt = generateJobAnalysisPrompt(mockJobAnalysisRequest)
    const validation = validatePromptTemplate("jobAnalysis", validPrompt)

    expect(validation.isValid).toBe(true)
    expect(validation.issues).toHaveLength(0)
  })

  it("should detect missing required elements in job analysis prompts", () => {
    const invalidPrompt = "Short prompt without JSON or required fields"
    const validation = validatePromptTemplate("jobAnalysis", invalidPrompt)

    expect(validation.isValid).toBe(false)
    expect(validation.issues.length).toBeGreaterThan(0)
    // Should have issues with short length and missing JSON
    expect(
      validation.issues.some(
        (issue) =>
          issue.toLowerCase().includes("json") ||
          issue.toLowerCase().includes("short")
      )
    ).toBe(true)
  })

  it("should validate CV adaptation prompts correctly", () => {
    const validPrompt = generateCVAdaptationPrompt(
      mockCVData,
      mockJobAnalysisResponse
    )
    const validation = validatePromptTemplate("cvAdaptation", validPrompt)

    expect(validation.isValid).toBe(true)
    expect(validation.issues).toHaveLength(0)
  })

  it("should validate cover letter prompts correctly", () => {
    const validPrompt = generateCoverLetterPrompt(mockCoverLetterRequest)
    const validation = validatePromptTemplate("coverLetter", validPrompt)

    expect(validation.isValid).toBe(true)
    expect(validation.issues).toHaveLength(0)
  })

  it("should detect prompts that are too short", () => {
    const shortPrompt = "Too short"
    const validation = validatePromptTemplate("jobAnalysis", shortPrompt)

    expect(validation.isValid).toBe(false)
    expect(validation.issues).toContain(
      "Prompt is too short - may not provide sufficient context"
    )
  })

  it("should detect prompts that are too long", () => {
    const longPrompt = "a".repeat(15000)
    const validation = validatePromptTemplate("jobAnalysis", longPrompt)

    expect(validation.isValid).toBe(false)
    expect(validation.issues).toContain(
      "Prompt is too long - may exceed token limits"
    )
  })

  it("should validate different prompt types with specific requirements", () => {
    // Test CV adaptation specific validation
    const cvPromptWithoutOptimization = generateJobAnalysisPrompt(
      mockJobAnalysisRequest
    )
    const cvValidation = validatePromptTemplate(
      "cvAdaptation",
      cvPromptWithoutOptimization
    )
    expect(cvValidation.isValid).toBe(false)
    expect(cvValidation.issues).toContain(
      "CV adaptation prompt missing optimization elements"
    )

    // Test cover letter specific validation
    const coverLetterPromptWithoutFormatting = generateJobAnalysisPrompt(
      mockJobAnalysisRequest
    )
    const coverLetterValidation = validatePromptTemplate(
      "coverLetter",
      coverLetterPromptWithoutFormatting
    )
    expect(coverLetterValidation.isValid).toBe(false)
    expect(coverLetterValidation.issues).toContain(
      "Cover letter prompt missing formatting requirements"
    )
  })
})

describe("Prompt Integration Tests", () => {
  it("should generate coherent prompts for the complete workflow", () => {
    // Test the full workflow: job analysis -> CV adaptation -> cover letter
    const jobPrompt = generateJobAnalysisPrompt(mockJobAnalysisRequest)
    const cvPrompt = generateCVAdaptationPrompt(
      mockCVData,
      mockJobAnalysisResponse
    )
    const letterPrompt = generateCoverLetterPrompt(mockCoverLetterRequest)

    // All prompts should be substantial and include key elements
    expect(jobPrompt.length).toBeGreaterThan(500)
    expect(cvPrompt.length).toBeGreaterThan(1000)
    expect(letterPrompt.length).toBeGreaterThan(800)

    // All prompts should require JSON output
    expect(jobPrompt).toContain("JSON")
    expect(cvPrompt).toContain("JSON")
    expect(letterPrompt).toContain("JSON")

    // Prompts should be contextually appropriate
    expect(jobPrompt).toContain("HR analyst")
    expect(cvPrompt).toContain("CV writer")
    expect(letterPrompt).toContain("career counselor")
  })

  it("should handle edge cases gracefully", () => {
    // Test with minimal data
    const minimalJobRequest: JobAnalysisRequest = {
      jobOffer: "Developer needed",
    }

    const minimalCVData: CVData = {
      ...mockCVData,
      WorkExperiences: [],
      skills: [],
      projects: [],
    }

    const minimalCoverLetterRequest: CoverLetterRequest = {
      cvData: minimalCVData,
      jobAnalysis: mockJobAnalysisResponse,
      tone: "Professional",
    }

    expect(() => generateJobAnalysisPrompt(minimalJobRequest)).not.toThrow()
    expect(() =>
      generateCVAdaptationPrompt(minimalCVData, mockJobAnalysisResponse)
    ).not.toThrow()
    expect(() =>
      generateCoverLetterPrompt(minimalCoverLetterRequest)
    ).not.toThrow()
  })

  it("should maintain consistency across related prompts", () => {
    // Generate prompts for the same job/CV combination
    const jobPrompt = generateJobAnalysisPrompt(mockJobAnalysisRequest)
    const cvPrompt = generateCVAdaptationPrompt(
      mockCVData,
      mockJobAnalysisResponse
    )
    const letterPrompt = generateCoverLetterPrompt(mockCoverLetterRequest)

    // Check that common elements appear in related prompts
    const commonKeywords = ["JavaScript", "React", "Node.js"]
    commonKeywords.forEach((keyword) => {
      expect(cvPrompt).toContain(keyword)
      expect(letterPrompt).toContain(keyword)
    })

    // Job prompt should contain the original job offer content
    expect(jobPrompt).toContain(mockJobAnalysisRequest.jobOffer)

    // Check that job-specific information is consistent
    // CV prompt contains job analysis data including required skills and industry keywords
    expect(cvPrompt.toLowerCase()).toContain("fintech")
    expect(letterPrompt.toLowerCase()).toContain("software engineer")
  })
})
