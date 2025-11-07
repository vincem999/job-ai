/**
 * Test utilities for error handling
 * This file provides mock functions for testing error scenarios
 */

import type { H3Event } from 'h3'

/**
 * Creates a mock H3Event for testing purposes
 * WARNING: This is for testing only and should not be used in production
 */
function createMockEvent(): H3Event {
  return {
    node: {
      req: {
        method: 'POST',
        url: '/api/test',
        headers: {
          'user-agent': 'Test-Agent/1.0'
        }
      },
      res: {
        statusCode: 200,
        setHeader: () => {},
        end: () => {}
      }
    }
  } as unknown as H3Event
}

/**
 * Mock error for testing
 */
export function createTestError(message = 'Test error') {
  return new Error(message)
}

/**
 * Export test utilities
 */
export { createMockEvent }