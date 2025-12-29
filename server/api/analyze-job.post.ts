import { defineEventHandler } from "h3"
import { generateJobAnalysisPrompt } from "../utils/openai/prompts"
import { handleError } from "../utils/errorHandler"
import { validateJobAnalysisRequest } from "../utils/validation/middleware"

/**
 * API endpoint to analyze job offers using OpenAI API
 * POST /api/analyze-job
 */
export default defineEventHandler(async (event) => {
  const startTime = Date.now()

  const jobAnalysisSchema = {
    type: "object",
    properties: {
      requiredSkills: {
        type: "array",
        items: { type: "string" },
      },
      preferredSkills: {
        type: "array",
        items: { type: "string" },
      },
      responsibilities: {
        type: "array",
        items: { type: "string" },
      },
      requirements: {
        type: "array",
        items: { type: "string" },
      },
      experienceLevel: {
        type: "string",
        enum: ["Entry", "Junior", "Mid", "Senior", "Lead", "Executive"],
      },
      industryKeywords: {
        type: "array",
        items: { type: "string" },
      },
    },
    required: [
      "requiredSkills",
      "preferredSkills",
      "responsibilities",
      "requirements",
      "experienceLevel",
      "industryKeywords",
    ],
    additionalProperties: false,
  }

  try {
    // Validate and sanitize request body using middleware
    const sanitizedRequest: JobAnalysisRequest =
      await validateJobAnalysisRequest(event)

    const prompt = generateJobAnalysisPrompt(sanitizedRequest)

    const client = getOpenAIClient()
    const response = await client.responses.create({
      model: "gpt-4o-2024-08-06",
      input: [
        {
          role: "system",
          content:
            "Tu es un expert en analyse d'offres d'emploi. Réponds toujours en JSON valide uniquement.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "job_analysis",
          strict: true,
          schema: jobAnalysisSchema,
        },
      },
    })

    return {
      success: true,
      data: JSON.parse(response.output_text),
    }
  } catch (error) {
    const processingTime = Date.now() - startTime
    console.error(
      `❌ API: Job analysis failed after ${processingTime}ms:`,
      error
    )

    // Use existing error handler for consistent error responses
    return handleError(error, event)
  }
})
