import { defineEventHandler } from "h3"
import { generateATSMatchingPrompt } from "../utils/openai/prompts"
import { getOpenAIClient } from "../utils/openai/client"
import { handleError } from "../utils/errorHandler"
import { validateATSMatchingRequest } from "../utils/validation/middleware"
import type { ATSMatchingRequest } from "../utils/validation/schemas"

/**
 * API endpoint to evaluate ATS compatibility between CV and job offer
 * POST /api/ats-matching
 */
export default defineEventHandler(async (event) => {
  const startTime = Date.now()

  // JSON Schema pour l'API OpenAI responses
  const atsMatchingSchema = {
    type: "object",
    properties: {
      atsScore: {
        type: "number",
        minimum: 0,
        maximum: 100,
      },
      scoreBreakdown: {
        type: "object",
        properties: {
          requiredKeywords: {
            type: "object",
            properties: {
              score: { type: "number" },
              maxScore: { type: "number" },
              foundKeywords: {
                type: "array",
                items: { type: "string" },
              },
              missingKeywords: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["score", "maxScore", "foundKeywords", "missingKeywords"],
            additionalProperties: false,
          },
          preferredKeywords: {
            type: "object",
            properties: {
              score: { type: "number" },
              maxScore: { type: "number" },
              foundKeywords: {
                type: "array",
                items: { type: "string" },
              },
              missingKeywords: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["score", "maxScore", "foundKeywords", "missingKeywords"],
            additionalProperties: false,
          },
          textOptimization: {
            type: "object",
            properties: {
              score: { type: "number" },
              maxScore: { type: "number" },
              keywordDensity: { type: "string" },
              strategicPlacement: { type: "boolean" },
            },
            required: ["score", "maxScore", "keywordDensity", "strategicPlacement"],
            additionalProperties: false,
          },
        },
        required: ["requiredKeywords", "preferredKeywords", "textOptimization"],
        additionalProperties: false,
      },
      recommendations: {
        type: "object",
        properties: {
          criticalMissing: {
            type: "array",
            items: { type: "string" },
          },
          suggestions: {
            type: "array",
            items: { type: "string" },
          },
          keywordVariations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                original: { type: "string" },
                alternatives: {
                  type: "array",
                  items: { type: "string" },
                },
              },
              required: ["original", "alternatives"],
              additionalProperties: false,
            },
          },
        },
        required: ["criticalMissing", "suggestions", "keywordVariations"],
        additionalProperties: false,
      },
      adaptationNeeded: { type: "boolean" },
      adaptationPriority: {
        type: "string",
        enum: ["low", "medium", "high", "critical"],
      },
      summary: { type: "string" },
    },
    required: [
      "atsScore",
      "scoreBreakdown",
      "recommendations",
      "adaptationNeeded",
      "adaptationPriority",
      "summary",
    ],
    additionalProperties: false,
  }

  try {
    // Validation et parsing des données d'entrée
    const sanitizedRequest: ATSMatchingRequest = await validateATSMatchingRequest(event)

    // Génération du prompt
    const prompt = generateATSMatchingPrompt(
      sanitizedRequest.cvData,
      sanitizedRequest.jobAnalysis
    )

    // Appel à l'API OpenAI avec structured output
    const client = getOpenAIClient()
    const response = await client.responses.create({
      model: "gpt-4o-2024-08-06",
      input: [
        {
          role: "system",
          content:
            "Tu es un expert en optimisation ATS. Analyse la compatibilité du CV avec les systèmes de tri automatique. Réponds toujours en JSON valide uniquement.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "ats_matching_analysis",
          strict: true,
          schema: atsMatchingSchema,
        },
      },
    })

    const processingTime = Date.now() - startTime
    console.log(`✅ API: ATS matching analysis completed in ${processingTime}ms`)

    return {
      success: true,
      data: JSON.parse(response.output_text),
      processingTime,
    }
  } catch (error) {
    const processingTime = Date.now() - startTime
    console.error(
      `❌ API: ATS matching analysis failed after ${processingTime}ms:`,
      error
    )

    return handleError(error, event)
  }
})