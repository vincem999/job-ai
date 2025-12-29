import { defineEventHandler } from "h3"
import { generateCVAdaptationPrompt } from "../utils/openai/prompts"
import type { CVAdaptationRequest } from "../utils/validation/schemas"
import { handleError } from "../utils/errorHandler"
import { validateCVAdaptationRequest } from "../utils/validation/middleware"
import { getOpenAIClient } from "../utils/openai/client"

/**
 * API endpoint to adapt CVs based on job analysis
 * POST /api/adapt-cv
 *
 * Takes a CV and job analysis data and returns optimized CV content
 * that better matches the job requirements while maintaining authenticity.
 */
export default defineEventHandler(async (event) => {
  const startTime = Date.now()

  try {
    // Validate, transform, and sanitize request body using middleware
    const sanitizedRequest: CVAdaptationRequest =
      await validateCVAdaptationRequest(event)

    // Generate prompt for OpenAI
    const prompt = generateCVAdaptationPrompt(
      sanitizedRequest.cvData,
      sanitizedRequest.jobAnalysis,
      sanitizedRequest.focusAreas || [],
      { maxLength: 2000 }
    )

    const adaptationSchema = {
      type: "object",
      properties: {
        workExperiences: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string" },
              company: { type: "string" },
              location: { type: "string" },
              startDate: { type: "string" },
              endDate: { type: "string" },
              description: { type: "string" },
              bullets: { type: "array", items: { type: "string" } },
            },
            required: [
              "id",
              "company",
              "title",
              "location",
              "endDate",
              "startDate",
              "description",
              "bullets",
            ],
            additionalProperties: false,
          },
        },
      },
      required: ["workExperiences"],
      additionalProperties: false,
    }

    const client = getOpenAIClient()
    const response = await client.responses.create({
      model: "gpt-4o-2024-08-06",
      input: [
        {
          role: "system",
          content:
            "Tu es un expert en optimisation de CV. Réponds toujours en JSON valide uniquement.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "cv_adaptation",
          strict: true,
          schema: adaptationSchema,
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
      `❌ API: CV adaptation failed after ${processingTime}ms:`,
      error
    )

    // Use existing error handler for consistent error responses
    return handleError(error, event)
  }
})
