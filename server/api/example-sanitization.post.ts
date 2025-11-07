/**
 * Example API route demonstrating input sanitization
 * This shows how to use the sanitization utility in a real Nuxt API endpoint
 */

import { defineEventHandler, readBody } from 'h3'
import {
  sanitizeInput,
  sanitizeForDatabase,
  sanitizeEmail,
  sanitizeUrl
} from '../utils/validation/sanitize';
import { handleError, createError } from '../utils/errorHandler';

export default defineEventHandler(async (event) => {
  try {
    // Read the request body
    const body = await readBody(event);

    // Sanitize all inputs before processing
    const sanitizedData = {
      // Basic sanitization for general text input
      title: sanitizeInput(body.title || ''),

      // Database-safe sanitization for stored data
      description: sanitizeForDatabase(body.description || ''),

      // Email validation and sanitization
      email: body.email ? sanitizeEmail(body.email) : undefined,

      // URL validation and sanitization
      website: body.website ? sanitizeUrl(body.website) : undefined,

      // Custom sanitization with configuration
      content: sanitizeInput(body.content || '', {
        maxLength: 5000,
        strictMode: false // Allow more flexibility for content
      })
    };

    // Log sanitization for security monitoring (in production, use proper logging)
    console.log('Sanitized input data:', {
      originalKeys: Object.keys(body),
      sanitizedKeys: Object.keys(sanitizedData),
      timestamp: new Date().toISOString()
    });

    // Simulate processing the sanitized data
    // In a real application, you would save to database, call other services, etc.
    const result = {
      success: true,
      message: 'Data successfully sanitized and processed',
      data: sanitizedData,
      metadata: {
        inputFields: Object.keys(body).length,
        outputFields: Object.keys(sanitizedData).length,
        processedAt: new Date().toISOString()
      }
    };

    return result;

  } catch (error) {
    // Handle specific sanitization errors with appropriate error types
    if (error instanceof Error) {
      if (error.message.includes('Invalid email format')) {
        return handleError(createError.validation('Invalid email address provided', {
          field: 'email',
          value: error.message
        }), event);
      }

      if (error.message.includes('Invalid URL')) {
        return handleError(createError.validation('Invalid URL provided', {
          field: 'website',
          value: error.message
        }), event);
      }

      if (error.message.includes('Input contains invalid characters')) {
        return handleError(createError.validation('Input contains invalid characters', {
          field: 'input',
          value: error.message
        }), event);
      }
    }

    // Log and handle unknown errors
    console.error('Sanitization error:', error);
    return handleError(error, event);
  }
});