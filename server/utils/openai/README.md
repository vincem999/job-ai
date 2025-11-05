# OpenAI Client Configuration

This directory contains the OpenAI client setup for the CV Optimizer application using the gpt-5 model.

## Setup

### Environment Variables

The OpenAI client requires an API key to be configured in your environment:

```bash
# .env file
OPENAI_API_KEY=sk-proj-your-openai-api-key-here
```

### Nuxt Configuration

The API key is configured in `nuxt.config.ts` as a private runtime config:

```typescript
runtimeConfig: {
  openaiApiKey: process.env.OPENAI_API_KEY,
}
```

## Usage

### Basic Usage

```typescript
import { getOpenAIClient } from '~/server/utils/openai/client'

// Get the singleton client instance
const openai = getOpenAIClient()

// Make API calls
const completion = await openai.chat.completions.create({
  model: 'gpt-5',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello!' }
  ],
  max_completion_tokens: 100
})
```

### Important Notes for gpt-5

The gpt-5 model has specific requirements and limitations:

1. **Token Parameter**: Use `max_completion_tokens` instead of `max_tokens`
2. **Temperature**: The temperature parameter is not supported (only default value of 1)
3. **Reasoning Tokens**: The model may use reasoning tokens, visible in usage statistics

### Error Handling

```typescript
try {
  const openai = getOpenAIClient()
  const completion = await openai.chat.completions.create({
    model: 'gpt-5',
    messages: [{ role: 'user', content: 'Hello!' }],
    max_completion_tokens: 100
  })

  return completion.choices[0]?.message?.content
} catch (error) {
  if (error instanceof OpenAI.APIError) {
    console.error(`OpenAI API Error: ${error.status} - ${error.message}`)
  } else {
    console.error('Unexpected error:', error)
  }
  throw error
}
```

## Configuration Details

### Client Configuration

- **Max Retries**: 3 (with exponential backoff)
- **Timeout**: 30 seconds per request
- **Singleton Pattern**: Only one client instance is created per application lifecycle

### Model Information

- **Model**: gpt-5 (specifically gpt-5-2025-08-07)
- **Capabilities**: Advanced reasoning with reasoning tokens
- **Limitations**: Fixed temperature, specific token parameter naming

## Testing

For testing purposes, you can reset the client instance:

```typescript
import { resetOpenAIClient } from '~/server/utils/openai/client'

// Reset client (useful in tests)
resetOpenAIClient()
```

## Security

- API key is never exposed to the client-side code
- Configured as private runtime config in Nuxt
- Accessed only through server-side utilities

## Troubleshooting

### Common Issues

1. **Missing API Key**: Ensure `OPENAI_API_KEY` is set in your environment
2. **Invalid Model Parameters**: Check gpt-5 specific requirements
3. **Timeout Errors**: Consider increasing timeout for complex requests
4. **Rate Limiting**: Implement proper rate limiting in your API routes

### Debugging

Enable debug logging by checking the OpenAI client response:

```typescript
const completion = await openai.chat.completions.create({...})
console.log('Usage:', completion.usage)
console.log('Model:', completion.model)
```