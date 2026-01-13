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

  // Check if CV data is provided for ATS optimization
  const body = await readBody(event)
  const hasCV = !!body.cvData
  console.log("le hasss CV", hasCV)
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
      ...(hasCV && {
        atsOptimization: {
          type: "object",
          properties: {
            score: {
              type: "number",
              minimum: 0,
              maximum: 100,
            },
            adaptationNeeded: {
              type: "boolean",
            },
            keywords: {
              type: "object",
              properties: {
                matched: {
                  type: "array",
                  items: { type: "string" },
                },
                missing: {
                  type: "array",
                  items: { type: "string" },
                },
                recommended: {
                  type: "array",
                  items: { type: "string" },
                },
              },
              required: ["matched", "missing", "recommended"],
              additionalProperties: false,
            },
            suggestions: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: ["score", "adaptationNeeded", "keywords", "suggestions"],
          additionalProperties: false,
        },
      }),
    },
    required: [
      "requiredSkills",
      "preferredSkills",
      "responsibilities",
      "requirements",
      "experienceLevel",
      "industryKeywords",
      ...(hasCV ? ["atsOptimization"] : []),
    ],
    additionalProperties: false,
  }

  try {
    // Use the body we already read for validation
    const { parseJobAnalysisRequest } = await import(
      "../utils/validation/schemas"
    )
    const parseResult = parseJobAnalysisRequest(body)

    if (!parseResult.success) {
      console.log(parseResult)
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid request data",
      })
    }

    const sanitizedRequest: JobAnalysisRequest = parseResult.data
    const prompt = generateJobAnalysisPrompt(sanitizedRequest)

    const client = getOpenAIClient()
    const response = await client.responses.create({
      model: "gpt-4o-2024-08-06",
      input: [
        {
          role: "system",
          content: hasCV
            ? "Tu es un expert en analyse d'offres d'emploi et optimisation ATS. Réponds toujours en JSON valide uniquement."
            : "Tu es un expert en analyse d'offres d'emploi. Réponds toujours en JSON valide uniquement.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: hasCV ? "job_analysis_with_ats" : "job_analysis",
          strict: true,
          schema: jobAnalysisSchema,
        },
      },
    })

    const processingTime = Date.now() - startTime
    const analysisType = hasCV
      ? "Job analysis with ATS optimization"
      : "Job analysis"
    console.log(`✅ API: ${analysisType} completed in ${processingTime}ms`)

    return {
      success: true,
      data: JSON.parse(response.output_text),
      processingTime,
      hasAtsOptimization: hasCV,
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
