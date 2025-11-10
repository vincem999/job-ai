# API Documentation

This document describes the REST API endpoints for the Job Finder CV Optimizer application.

## Base URL

```
https://your-domain.com/api
```

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Response Format

All API responses follow a consistent JSON format:

### Success Response

```json
{
  "success": true,
  "data": { /* endpoint-specific data */ },
  "processingTime": 1234,
  "timestamp": "2023-12-07T10:30:00.000Z"
}
```

### Error Response

All error responses follow this standardized format:

```json
{
  "success": false,
  "code": "ERROR_CODE",
  "error": "Human-readable error message",
  "timestamp": "2023-12-07T10:30:00.000Z",
  "requestId": "req_1234567890_abc123def",
  "details": {
    "stack": "Error stack trace (development only)",
    "cause": "Original error message (development only)",
    "context": {
      /* Additional error context (development only) */
    }
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_INPUT` | 400 | Invalid request input |
| `INVALID_EMAIL` | 400 | Invalid email format |
| `INVALID_URL` | 400 | Invalid URL format |
| `MISSING_REQUIRED_FIELD` | 400 | Required field is missing |
| `VALIDATION_ERROR` | 422 | Request validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Access denied |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMITED` | 429 | Too many requests |
| `PAYLOAD_TOO_LARGE` | 413 | Request payload too large |
| `PROCESSING_ERROR` | 500 | Internal server error |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `EXTERNAL_SERVICE_ERROR` | 502 | External service unavailable |
| `CONFIGURATION_ERROR` | 500 | Server configuration error |
| `UNKNOWN_ERROR` | 500 | Unexpected error occurred |

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Window**: 15 minutes
- **Max requests**: 100 per window
- **Ban duration**: 1 hour for exceeding limits

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Unix timestamp when window resets
- `Retry-After`: Seconds to wait when rate limited

## Endpoints

### 1. Analyze Job Offer

Analyzes job offer text and extracts structured information.

**Endpoint**: `POST /api/analyze-job`

**Request Body**:
```json
{
  "jobOffer": "string (required) - Job offer text to analyze"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "positionTitle": "Software Engineer",
    "companyName": "Tech Corp",
    "requiredSkills": ["JavaScript", "React", "Node.js"],
    "preferredSkills": ["TypeScript", "MongoDB"],
    "workType": "remote",
    "experienceLevel": "mid-level",
    "location": "San Francisco, CA",
    "salary": {
      "min": 80000,
      "max": 120000,
      "currency": "USD"
    },
    "responsibilities": ["Develop web applications", "Collaborate with team"],
    "requirements": ["3+ years experience", "Bachelor's degree"],
    "industryKeywords": ["fintech", "startup"],
    "suggestions": ["Highlight React experience", "Mention agile methodologies"]
  },
  "processingTime": 2500,
  "timestamp": "2023-12-07T10:30:00.000Z"
}
```

**Error Examples**:
```json
// Missing job offer text
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "error": "Invalid request data",
  "timestamp": "2023-12-07T10:30:00.000Z",
  "requestId": "req_1234567890_abc123def",
  "details": {
    "context": {
      "validationErrors": [
        {
          "path": ["jobOffer"],
          "message": "Required"
        }
      ]
    }
  }
}

// Rate limited
{
  "success": false,
  "code": "RATE_LIMITED",
  "error": "Too many requests, please try again later",
  "timestamp": "2023-12-07T10:30:00.000Z",
  "requestId": "req_1234567890_abc123def"
}
```

### 2. Adapt CV

Optimizes CV content based on job analysis data.

**Endpoint**: `POST /api/adapt-cv`

**Request Body**:
```json
{
  "cvData": {
    "personalInfo": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@email.com",
      "phone": "+1234567890",
      "address": "123 Main St, City, Country"
    },
    "workExperience": [
      {
        "id": "1",
        "position": "Software Developer",
        "company": "Previous Corp",
        "startDate": "2021-01-01T00:00:00.000Z",
        "endDate": "2023-12-01T00:00:00.000Z",
        "description": "Developed web applications using React and Node.js",
        "achievements": ["Increased performance by 30%", "Led team of 3 developers"]
      }
    ],
    "skills": [
      {
        "id": "1",
        "name": "JavaScript",
        "level": "expert"
      }
    ],
    "education": [],
    "certifications": [],
    "projects": []
  },
  "jobAnalysis": {
    /* Job analysis data from /api/analyze-job */
  },
  "focusAreas": ["technical skills", "leadership"]
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "adaptedPersonalInfo": {
      "summary": "Experienced software engineer with expertise in React and Node.js..."
    },
    "prioritizedWorkExperience": [
      {
        "id": "1",
        "enhancedDescription": "Enhanced description emphasizing relevant skills",
        "highlightedAchievements": ["Performance optimization", "Team leadership"],
        "relevantSkills": ["React", "Node.js", "Leadership"],
        "matchingScore": 95
      }
    ],
    "optimizedSkills": [
      {
        "id": "1",
        "priority": "high",
        "justification": "Directly matches job requirements"
      }
    ],
    "recommendedSections": {
      "order": ["personalInfo", "workExperience", "skills", "education"],
      "emphasis": {
        "workExperience": "high",
        "skills": "high",
        "education": "medium"
      }
    },
    "keywordOptimization": {
      "addedKeywords": ["React", "Node.js", "Agile"],
      "naturalPlacements": [
        {
          "keyword": "React",
          "section": "workExperience",
          "context": "Developed React applications"
        }
      ]
    },
    "improvementSuggestions": ["Add more quantified achievements"],
    "overallMatchScore": 87,
    "strengthsHighlighted": ["Technical expertise", "Leadership experience"],
    "gapsToAddress": ["Industry-specific experience"]
  },
  "processingTime": 3500,
  "timestamp": "2023-12-07T10:30:00.000Z"
}
```

### 3. Generate Cover Letter

Creates a personalized cover letter based on CV and job analysis.

**Endpoint**: `POST /api/generate-letter`

**Request Body**:
```json
{
  "cvData": {
    /* CV data structure same as adapt-cv */
  },
  "jobAnalysis": {
    /* Job analysis data from /api/analyze-job */
  },
  "additionalInfo": {
    "motivation": "I am passionate about...",
    "companyResearch": "I admire your company because..."
  }
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "coverLetter": {
      "header": {
        "candidateName": "John Doe",
        "candidateEmail": "john.doe@email.com",
        "date": "December 7, 2023",
        "recipientInfo": "Hiring Manager at Tech Corp"
      },
      "content": {
        "opening": "Dear Hiring Manager,\n\nI am writing to express my interest...",
        "bodyParagraph1": "With over 3 years of experience...",
        "bodyParagraph2": "My technical expertise in React and Node.js...",
        "closing": "Thank you for considering my application..."
      },
      "fullText": "Complete formatted cover letter text",
      "wordCount": 350,
      "keyHighlights": ["React expertise", "Leadership experience", "Performance optimization"]
    },
    "matchingElements": {
      "addressedRequirements": ["3+ years experience", "React proficiency"],
      "highlightedSkills": ["JavaScript", "Node.js", "Team leadership"],
      "quantifiedAchievements": ["30% performance increase", "Led team of 3"]
    },
    "suggestions": ["Consider adding specific company values alignment"]
  },
  "processingTime": 2800,
  "timestamp": "2023-12-07T10:30:00.000Z"
}
```

### 4. Get CV Data

Retrieves the master CV data.

**Endpoint**: `GET /api/cv`

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    /* Complete CV data structure */
  },
  "status": {
    "loaded": true,
    "ready": true,
    "error": null
  }
}
```

**Error Examples**:
```json
// CV not ready
{
  "success": false,
  "code": "PROCESSING_ERROR",
  "error": "CV data is not available",
  "timestamp": "2023-12-07T10:30:00.000Z",
  "requestId": "req_1234567890_abc123def"
}
```

## Common Error Scenarios

### Validation Errors

When request validation fails, you'll receive a `422` status with detailed validation information:

```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "error": "Invalid request data",
  "timestamp": "2023-12-07T10:30:00.000Z",
  "requestId": "req_1234567890_abc123def",
  "details": {
    "context": {
      "validationErrors": [
        {
          "path": ["cvData", "personalInfo", "email"],
          "message": "Invalid email format"
        },
        {
          "path": ["jobAnalysis"],
          "message": "Required field missing"
        }
      ]
    }
  }
}
```

### External Service Errors

When OpenAI API or other external services fail:

```json
{
  "success": false,
  "code": "EXTERNAL_SERVICE_ERROR",
  "error": "External service error: OpenAI API",
  "timestamp": "2023-12-07T10:30:00.000Z",
  "requestId": "req_1234567890_abc123def",
  "details": {
    "context": {
      "service": "OpenAI API"
    }
  }
}
```

### Rate Limiting

When rate limit is exceeded:

```json
{
  "success": false,
  "code": "RATE_LIMITED",
  "error": "Too many requests, please try again later",
  "timestamp": "2023-12-07T10:30:00.000Z",
  "requestId": "req_1234567890_abc123def",
  "details": {
    "context": {
      "retryAfter": 3600
    }
  }
}
```

## Request/Response Headers

### Standard Headers

All requests should include:
- `Content-Type: application/json`
- `Accept: application/json`

### Response Headers

All responses include:
- `Content-Type: application/json`
- `X-Request-ID: req_1234567890_abc123def`
- Rate limiting headers (when applicable)

## Testing

You can test the API endpoints using curl, Postman, or any HTTP client:

```bash
# Test job analysis
curl -X POST https://your-domain.com/api/analyze-job \
  -H "Content-Type: application/json" \
  -d '{"jobOffer": "We are looking for a React developer..."}'

# Test CV data retrieval
curl -X GET https://your-domain.com/api/cv \
  -H "Accept: application/json"
```

## Error Debugging

For development environments, error responses include additional debugging information in the `details` field:

- `stack`: Full error stack trace
- `cause`: Original error message
- `context`: Additional context about the error

In production, these details are omitted for security reasons.

## Support

For API support or questions, please contact the development team or create an issue in the project repository.