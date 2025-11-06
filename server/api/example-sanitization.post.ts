/**
 * Example API route demonstrating input sanitization
 * This shows how to use the sanitization utility in a real Nuxt API endpoint
 */

import {
  sanitizeInput,
  sanitizeForDatabase,
  sanitizeEmail,
  sanitizeUrl
} from '../utils/validation/sanitize';

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
    // Handle sanitization errors (e.g., invalid email, invalid URL)
    if (error instanceof Error) {
      if (error.message.includes('Invalid email format')) {
        setResponseStatus(event, 400);
        return {
          success: false,
          error: 'Invalid email address provided',
          code: 'INVALID_EMAIL'
        };
      }

      if (error.message.includes('Invalid URL')) {
        setResponseStatus(event, 400);
        return {
          success: false,
          error: 'Invalid URL provided',
          code: 'INVALID_URL'
        };
      }

      if (error.message.includes('Input contains invalid characters')) {
        setResponseStatus(event, 400);
        return {
          success: false,
          error: 'Input contains invalid characters',
          code: 'INVALID_INPUT'
        };
      }
    }

    // Log the error for debugging (in production, use proper error logging)
    console.error('Sanitization error:', error);

    setResponseStatus(event, 500);
    return {
      success: false,
      error: 'Internal server error during input processing',
      code: 'PROCESSING_ERROR'
    };
  }
});